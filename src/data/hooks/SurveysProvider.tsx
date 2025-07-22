"use client";

import React, { createContext, useEffect, useState } from "react";
import { Student } from "@/types/user-types";
import { collection, onSnapshot } from "firebase/firestore";
import { Collection } from "../firestore/utils";
import { db } from "@/config/firebaseConfig";
import { SurveyID } from "@/types/survey-types";

export interface SurveysContextType {
  surveys: SurveyID[];
}

export const SurveysContext = createContext<SurveysContextType>({
  surveys: [],
});

export default function SurveysProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  const [surveys, setSurveys] = useState<SurveyID[]>([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, Collection.SURVEYS),
      (snapshot) => {
        setSurveys(snapshot.docs.map((doc) => doc.data()) as SurveyID[]);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <SurveysContext.Provider value={{ surveys }}>
      {children}
    </SurveysContext.Provider>
  );
}
