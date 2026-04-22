import { auth } from "@/config/firebaseConfig";
import { getFunctionsURL } from "@/config/utils";
import { signInWithCustomToken } from "firebase/auth";
import { checkPasswordValidity } from "./emailPasswordAuthN";

function checkUsernameValidity(username: string) {
  username = username.trim().toLowerCase();
  if (username.length < 3) {
    throw Error("Username must be at least 3 characters.");
  } else if (username.length > 32) {
    throw Error("Username must be at most 32 characters.");
  } else if (!/^[a-zA-Z0-9.\-_]+$/.test(username)) {
    throw Error("Username must only contain alphanumeric characters, hyphens, underscores, and periods.");
  } else if (!/^[a-zA-Z].*$/.test(username)) {
    throw Error("Username must start with a letter.");
  } else if (!/^.*[a-zA-Z0-9]$/.test(username)) {
    throw Error("Username must end with a letter or number.");
  }
}

export async function signUpWithUsernamePassword(username: string, password: string) {
  checkUsernameValidity(username);
  await checkPasswordValidity(password);
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
  if (!res.ok) {
    throw new Error(body.error);
  }
  await signInWithCustomToken(auth, body.token);
}