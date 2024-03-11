import { google } from 'googleapis';

async function authenticateGoogleAPI() {
    const auth = new google.auth.GoogleAuth({
      keyFile: './googleCredentials.json', 
      scopes: ['https://www.googleapis.com/auth/forms'],
    });
  
    const authClient = await auth.getClient();
  };

async function createGoogleForm() {
    // authentication
    await authenticateGoogleAPI();

    // get the google form API
    const forms = google.forms({version: "v1"});

    // create a google form
    const form = await forms.forms.create({
        "requestBody": {
            "info": {
                "title": "Your Form Title",
            }
        }
    })

    console.log("Form Created: ", form.data);
    return form.data;
}

export { createGoogleForm }