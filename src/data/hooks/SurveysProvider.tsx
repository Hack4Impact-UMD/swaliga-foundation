"use client";

import React, { createContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Collection } from "../firestore/utils";
import { db } from "@/config/firebaseConfig";
import { SurveyID } from "@/types/survey-types";
import LoadingPage from "@/app/loading";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, Collection.SURVEYS),
      (snapshot) => {
        setSurveys(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SurveyID[]);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <SurveysContext.Provider value={{ surveys }}>
      {children}
    </SurveysContext.Provider>
  );
}
