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
      collection(db, Collection.ADMIN_DATA, "surveys", Collection.SURVEYS),
      (snapshot) => {
        const newSurveys: SurveyID[] = [];
        for (const doc of snapshot.docs) {
          for (const [id, survey] of Object.entries(doc.data())) {
            newSurveys.push({ id, ...survey } as SurveyID);
          }
        }
        setSurveys(newSurveys);
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
