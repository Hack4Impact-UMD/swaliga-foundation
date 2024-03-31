import { NextRequest, NextResponse } from "next/server";
import { forms } from "@/lib/googleAuthorization"
import { listenForMessages } from "@/lib/pubsub";
import { forms_v1, google } from "googleapis";

async function createFormWatch(formId: string, topicName: string) {
  try {

    // // TODO: Remove - Deletes the old watch
    // const delete_response = await forms.forms.watches.delete({
    //   formId: formId,
    //   watchId: 'some-watch'
    // });

    // // See if there is any output from attempting to delete an old watch
    // console.log("Delete response: ", delete_response);

    const response = await forms.forms.watches.create({
        formId: formId,
        requestBody: {
            watch: {  
                target: {
                    topic: {
                        topicName: topicName
                    }
                },
                eventType: 'RESPONSES',
            },
            watchId: "some-watch"
        } 
    });
    return response.data;

  } catch (error) {
    console.error('Error creating form watch: ', error);
    throw error;
  }
}

// First go to localhost:3000/api/auth/consent
// Then go to localhost:3000/api/forms
// https://developers.google.com/forms/api/guides/push-notifications
// also search up PubSub in the console itself
export async function GET() {

  createFormWatch('1_lKj7OZZ7PAxiyP4BaCyYk8o0Oa3KSWogxYFyIFzNTI', 'projects/swaliga-foundation/topics/forms');
  listenForMessages();
  return NextResponse.redirect("http://localhost:3000");
}