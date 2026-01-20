import { auth } from "@/config/firebaseConfig";
import { getFunctionsURL } from "@/config/utils";
import { signInWithCustomToken } from "firebase/auth";

export async function signUpWithUsernamePassword(username: string, password: string) {
  const res = await fetch(getFunctionsURL('signUpWithUsernamePassword'), {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error);
  }
  await signInWithCustomToken(auth, body.token);
}

export async function loginWithUsernamePassword(username: string, password: string) {
  const res = await fetch(getFunctionsURL("loginWithUsernamePassword"), {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
  const body = await res.json();
  console.log(body)
  if (!res.ok) {
    throw new Error(body.error);
  }
  await signInWithCustomToken(auth, body.token);
}