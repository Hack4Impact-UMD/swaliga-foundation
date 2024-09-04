import { createWatch } from "@/lib/firebase/database/watches";
import { getFormsClient } from "@/lib/googleAuthorization";
import { GoogleForm, Survey } from "@/types/survey-types";
import { Watch } from "@/types/watch-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let form: Survey | null = null;
    const body = await req.json();
    const { title } = body;
    console.log('title', title)
    const forms = await getFormsClient();
    let googleForm: GoogleForm = (
      await forms.forms.create({
        requestBody: {
          info: {
            title: title,
            documentTitle: title,
          },
        },
      })
    ).data as unknown as GoogleForm;

    // creates watches for the form for update & response handling
    const schemaWatch = await createWatch(googleForm.formId || "", "SCHEMA");
    const responsesWatch = await createWatch(googleForm.formId || "", "RESPONSES");

    // adds a question for Swaliga User ID to the form
    // important because watch event inputs do not contain the id of the user that submitted the form, which makes this id field necessary to identify the user later on
    googleForm = (
      await forms.forms.batchUpdate({
        formId: googleForm.formId,
        requestBody: {
          includeFormInResponse: true,
          requests: [
            {
              createItem: {
                item: {
                  itemId: "00000000",
                  title: "Swaliga User ID",
                  description:
                    "Make sure to copy this ID directly from your student dashboard",
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: {
                        paragraph: false,
                      },
                    },
                  },
                },
                location: {
                  index: 0,
                },
              },
            },
          ],
          writeControl: {
            targetRevisionId: googleForm.revisionId,
          },
        },
      })
    ).data.form as unknown as GoogleForm;

    // adds extra data to the form object for Firestore
    form = {
      ...googleForm,
      assignedUsers: [],
      responseIds: [],
      schemaWatch: schemaWatch as unknown as Watch,
      responsesWatch: responsesWatch as unknown as Watch,
      swaligaIdQuestionId: (googleForm.items[0] as any).questionItem.question
        .questionId,
    };
    return NextResponse.json(form, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "error creating survey" },
      { status: 500 }
    );
  }
}
