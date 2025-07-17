import * as authFunctions from "./auth";
import * as firestoreFunctions from './firestore';

exports.setAdminRole = authFunctions.setAdminRole;
exports.setStudentRole = authFunctions.setStudentRole;

exports.handleRecentUpdates = process.env.NODE_ENV === 'development' ? firestoreFunctions.testHandleRecentUpdates : firestoreFunctions.handleRecentUpdates;
exports.addExistingSurveyAndResponses = firestoreFunctions.addExistingSurveyAndResponses
exports.onSurveyDocCreated = firestoreFunctions.onSurveyDocCreated;
exports.onSurveyDocDeleted = firestoreFunctions.onSurveyDocDeleted;