import { Request } from "firebase-functions/https";

export function getUrlFromRequest(req: Request) {
  return new URL(`${req.protocol}://${req.get('host')}${req.url}`);
}