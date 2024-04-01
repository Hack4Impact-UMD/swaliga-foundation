import { forms } from "@/lib/googleAuthorization";
import { listenForMessages } from "@/lib/pubsub";
import { NextResponse } from "next/server";

// Create a watch for the given google form if it does not already exist.
async function createFormWatch(formId: string, topicName: string) {
  try {
    // Check if a watch already exists
    const watches = await forms.forms.watches.list({ formId });
    const watchExists = watches.data.watches?.find(watch => watch.eventType === 'RESPONSES');

    if (watchExists) {
      // No need to do anything
      console.log('Watch already exists');
      return {};
    } else {
      // Create a watch
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
    }
  } catch (error) {
    console.error('Error creating form watch: ', error);
    throw error;
  }
}

// NOTE:
// First go to localhost:3000/api/auth/consent to get consent
// Then go to localhost:3000/api/forms to set up the listener
export async function GET() {
  try {
    // Create the form watch if needed
    createFormWatch('1_lKj7OZZ7PAxiyP4BaCyYk8o0Oa3KSWogxYFyIFzNTI', 'projects/swaliga-foundation/topics/forms');

    // Listen for a message
    listenForMessages();

    // Go back to the home page
    return NextResponse.redirect("http://localhost:3000");
  } catch (error) {
    // Something went wrong. This unfortunately happens the first time every time you go to this endpoint, so until this is fixed
    // this code WILL cause errors.
    // To fix this, go to localhost:3000/api/auth/consent --> localhost:3000/api/forms -->
    //                    localhost:3000/api/auth/consent --> localhost:3000/api/forms

    // TODO: Did not fix this code to successfully try-catch, the full error message still appears. 
    console.log('forms route unsuccessful - please try again.');
  }
}