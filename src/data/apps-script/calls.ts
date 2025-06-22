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