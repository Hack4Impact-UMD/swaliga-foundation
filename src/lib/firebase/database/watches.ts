import { getFormsClient } from "@/lib/googleAuthorization";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function createWatch(formId: string, eventType: string) {
  try {
    const forms = await getFormsClient();
    const response = await forms.forms.watches.create({
      formId: formId,
      requestBody: {
        watch: {
          eventType: eventType,
          target: {
            topic: {
              topicName: "projects/swaliga-foundation/topics/forms",
            },
          },
        },
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error with creating watch using given information", error);
    throw error;
  }
}

// watches expire 7 days after they are created, so they must be renewed
export async function renewWatch(formId: string, watchId: string) {
  try {
    const forms = await getFormsClient();
    const response = await forms.forms.watches.renew({ formId, watchId });
    const watch = response.data;
    if (watch.eventType === "RESPONSES") {
      await setDoc(doc(db, "surveys", formId), { responsesWatch: watch }, { merge: true });
    } else if (watch.eventType === "SCHEMA") {
      await setDoc(doc(db, "surveys", formId), { schemaWatch: watch }, { merge: true });
    }
    return watch;
  } catch (error) {
    console.log(
      "Error with renewing watch using given formId and watchId",
      error
    );
    throw error;
  }
}
