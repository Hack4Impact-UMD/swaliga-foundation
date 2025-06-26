async function callAppsScript(accessToken: string, functionName: string, parameters?: any[]): Promise<any> {
  const response = await fetch(
    `https://script.googleapis.com/v1/scripts/${process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID}:run`,
    {
      method: "POST",
      body: JSON.stringify({
        function: functionName,
        parameters: parameters,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );
  const data = await response.json();
  if (data.error) {
    throw new Error("An unexpected error occurred. Please try again later.");
  }
  return data.response.result;
}

export async function createNewForm(accessToken: string, title: string, description: string): Promise<string> { return await callAppsScript(accessToken, 'createNewForm', [title, description]); }
export async function addExistingForm(accessToken: string, formId: string): Promise<void> { return await callAppsScript(accessToken, 'addExistingForm', [formId]); }
export async function deleteForm(accessToken: string, formId: string): Promise<void> { return await callAppsScript(accessToken, 'deleteForm', [formId]); }
export async function deleteForms(accessToken: string, formIds: string[]): Promise<void> { return await callAppsScript(accessToken, 'deleteForms', [formIds]); }