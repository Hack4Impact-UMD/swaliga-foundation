import * as authFunctions from "./auth";
import * as assignmentManagementFunctions from './firestore/assignmentManagement';
import * as responseManagementFunctions from './firestore/responseManagement';
import * as syncAdminDataFunctions from './firestore/syncAdminData';
import * as emailFunctions from './email';

exports.setRole = authFunctions.setRole;
exports.onStudentAccountCreated = authFunctions.onStudentAccountCreated;

exports.assignSurveys = assignmentManagementFunctions.assignSurveys;

exports.handleRecentUpdates = process.env.NODE_ENV === 'development' ? responseManagementFunctions.testHandleRecentUpdates : responseManagementFunctions.handleRecentUpdates;
exports.addExistingSurveyAndResponses = responseManagementFunctions.addExistingSurveyAndResponses;

exports.onSurveyDocCreated = syncAdminDataFunctions.onSurveyDocCreated;
exports.onSurveyDocUpdated = syncAdminDataFunctions.onSurveyDocUpdated;
exports.onSurveyDocDeleted = syncAdminDataFunctions.onSurveyDocDeleted;
exports.onStudentDocCreated = syncAdminDataFunctions.onStudentDocCreated;
exports.onStudentDocUpdated = syncAdminDataFunctions.onStudentDocUpdated;
exports.onStudentDocDeleted = syncAdminDataFunctions.onStudentDocDeleted;

exports.sendEmail = emailFunctions.sendEmail;