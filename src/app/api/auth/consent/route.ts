import { authorizeWithGoogle } from "@/lib/googleAuthorization";

export function GET() {
  authorizeWithGoogle();
}
