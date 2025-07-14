import { SurveyID } from '@/types/survey-types';
import { GoogleFormResponse, GoogleFormResponseEmail } from '@/types/apps-script-types';

declare global {
  // cronJob.js
  var getRecentUpdates: (surveyIds: string[], timeAfter: string) => {
    surveys: Pick<SurveyID, 'id' | 'name' | 'description'>[];
    responses: GoogleFormResponse[];
  }

  // responses.ts
  var getRecentResponses_: (surveyIds: string[], timeAfter: string) => GoogleFormResponse[];

  //surveys.ts
  var createNewSurvey: (title: string, description: string) => SurveyID;
  var addExistingSurvey: (surveyId: string) => {
    survey: SurveyID;
    responses: GoogleFormResponse[];
  }
  var addIdQuestion_: (survey: GoogleAppsScript.Forms.Form) => void;
  var setDefaultSurveySettings_: (survey: GoogleAppsScript.Forms.Form) => void;
  var getUpdatedSurveyTitlesAndDescriptions_: (surveyIds: string[], timeAfter: string) => Pick<SurveyID, 'id' | 'name' | 'description'>[];
  var getIdQuestionItem_: (items: GoogleAppsScript.Forms.Item[]) => GoogleAppsScript.Forms.Item | undefined;
}

export { };