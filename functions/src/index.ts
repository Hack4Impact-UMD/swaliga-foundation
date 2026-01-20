import * as authFunctions from "./auth";
import * as assignmentManagementFunctions from './firestore/assignmentManagement';
import * as responseManagementFunctions from './firestore/responseManagement';
import * as syncAdminDataFunctions from './firestore/syncAdminData';
import * as emailFunctions from './email';
import { appsScriptCloudFunctions } from "./googleAppsScript";

exports.setRole = authFunctions.setRole;
exports.onStudentAccountCreated = authFunctions.onStudentAccountCreated;
exports.handleEmailChange = authFunctions.handleEmailChange
exports.checkRefreshTokenValidity = authFunctions.checkRefreshTokenValidity;
exports.handleOAuth2Code = authFunctions.handleOAuth2Code;
exports.signUpWithUsernamePassword = authFunctions.signUpWithUsernamePassword;
exports.loginWithUsernamePassword = authFunctions.loginWithUsernamePassword;

exports.assignSurveys = assignmentManagementFunctions.assignSurveys;
exports.onAssignmentWritten = assignmentManagementFunctions.onAssignmentWritten;

exports.onFormSubmit = responseManagementFunctions.onFormSubmit;
exports.handleRecentSurveyTitlesAndDescriptionsUpdates = process.env.NODE_ENV === 'development' ? responseManagementFunctions.testHandleRecentSurveyTitlesAndDescriptionsUpdates : responseManagementFunctions.handleRecentSurveyTitlesAndDescriptionsUpdates;
exports.addExistingSurveyAndResponses = responseManagementFunctions.addExistingSurveyAndResponses;

exports.onSurveyDocCreated = syncAdminDataFunctions.onSurveyDocCreated;
exports.onSurveyDocUpdated = syncAdminDataFunctions.onSurveyDocUpdated;
exports.onSurveyDocDeleted = syncAdminDataFunctions.onSurveyDocDeleted;
exports.onStudentDocCreated = syncAdminDataFunctions.onStudentDocCreated;
exports.onStudentDocUpdated = syncAdminDataFunctions.onStudentDocUpdated;
exports.onStudentDocDeleted = syncAdminDataFunctions.onStudentDocDeleted;

exports.sendEmail = emailFunctions.sendEmail;

exports.appsScriptEndpoint = appsScriptCloudFunctions.appsScriptEndpoint