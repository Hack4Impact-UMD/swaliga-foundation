"use client";

import React, { createContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Collection, Document } from "../firestore/utils";
import { db } from "@/config/firebaseConfig";
import { SurveyID } from "@/types/survey-types";
import LoadingPage from "@/app/loading";
import { useSurveysDefault, useSurveysReturn } from "./useSurveys";

export const SurveysContext =
  createContext<useSurveysReturn>(useSurveysDefault);

export default function SurveysProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  const [surveys, setSurveys] = useState<SurveyID[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, Collection.ADMIN_DATA, Document.SURVEYS, Collection.SURVEYS),
      (snapshot) => {
        const newSurveys: SurveyID[] = [];
        for (const doc of snapshot.docs) {
          for (const [id, survey] of Object.entries(doc.data())) {
            newSurveys.push({ id, ...survey } as SurveyID);
          }
        }
        setSurveys(newSurveys);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        setIsError(true);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <SurveysContext.Provider value={{ surveys, isLoading, isError }}>
      {children}
    </SurveysContext.Provider>
  );
}
