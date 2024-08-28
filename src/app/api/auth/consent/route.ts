import { getAuthUrl } from "@/lib/googleAuthorization";
import { redirect } from "next/navigation";

export async function GET() {
  const authUrl = await getAuthUrl();
  redirect(authUrl);
}
