"use client"
import React from 'react';
import { signInWithGoogle, logOut } from '@/lib/firebase/googleAuth';

export default function Home() {
  return (
    <>
    <h1>Hello, Next.js!</h1>
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button> <br></br>
      <button onClick={logOut}>Sign out</button>
    </div>
    </>
  );
}
