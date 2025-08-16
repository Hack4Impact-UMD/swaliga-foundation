import * as authFunctions from "./auth";
import * as firestoreFunctions from './firestore';
import * as emailFunctions from './email';

exports.setRole = authFunctions.setRole;

exports.handleRecentUpdates = process.env.NODE_ENV === 'development' ? firestoreFunctions.testHandleRecentUpdates : firestoreFunctions.handleRecentUpdates;
exports.addExistingSurveyAndResponses = firestoreFunctions.addExistingSurveyAndResponses;
exports.assignSurveys = firestoreFunctions.assignSurveys;
exports.setStudentId = firestoreFunctions.setStudentId;
exports.onSurveyDocCreated = firestoreFunctions.onSurveyDocCreated;
exports.onSurveyDocUpdated = firestoreFunctions.onSurveyDocUpdated;
exports.onSurveyDocDeleted = firestoreFunctions.onSurveyDocDeleted;
exports.onStudentDocCreated = firestoreFunctions.onStudentDocCreated;
exports.onStudentDocUpdated = firestoreFunctions.onStudentDocUpdated;
exports.onStudentDocDeleted = firestoreFunctions.onStudentDocDeleted;

exports.sendEmail = emailFunctions.sendEmail;