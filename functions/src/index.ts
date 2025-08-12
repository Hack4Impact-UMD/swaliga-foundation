import * as authFunctions from "./auth";
import * as firestoreFunctions from './firestore';
import * as emailFunctions from './email';

exports.setRole = authFunctions.setRole;

exports.handleRecentUpdates = process.env.NODE_ENV === 'development' ? firestoreFunctions.testHandleRecentUpdates : firestoreFunctions.handleRecentUpdates;
exports.addExistingSurveyAndResponses = firestoreFunctions.addExistingSurveyAndResponses;
exports.assignSurveys = firestoreFunctions.assignSurveys;
exports.onSurveyDocCreated = firestoreFunctions.onSurveyDocCreated;
exports.onSurveyDocDeleted = firestoreFunctions.onSurveyDocDeleted;

exports.sendEmail = emailFunctions.sendEmail;