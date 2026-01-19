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
  const { token } = await res.json();
  await signInWithCustomToken(auth, token);
}

export async function loginWithUsernamePassword(username: string, password: string) {
  const res = await fetch(getFunctionsURL("loginWithUsernamePassword"), {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
  const { token } = await res.json();
  await signInWithCustomToken(auth, token);
}