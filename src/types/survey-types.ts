import { Watch } from "./watch-types";

export interface GoogleForm {
  formId: string;
  info: Info;
  settings: FormSettings;
  items: Item[];
  revisionId: string;
  responderUri: string;
  linkedSheetId?: string;
}

export interface Survey extends GoogleForm {
  assignedUsers: string[];
  responseIds: string[];
  schemaWatch: Watch;
  responsesWatch: Watch;
  swaligaIdQuestionId: string;
}

export interface GoogleFormResponse {
  formId: string;
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  respondentEmail: string;
  answers: { [questionId: string]: Answer };
  totalScore?: number;
}

export interface Response extends GoogleFormResponse {
  userId: string;
  formTitle: string;
}

// Info and settings
interface Info {
  title: string;
  documentTitle: string;
  description: string;
}

interface FormSettings {
  quizSettings?: QuizSettings;
}

interface QuizSettings {
  isQuiz: boolean;
}

// Items and questions
type Item =
  | QuestionItem
  | QuestionGroupItem
  | PageBreakItem
  | TextItem
  | ImageItem
  | VideoItem;

interface QuestionItem {
  question: Question;
  image?: Image;
}

interface QuestionGroupItem {
  questions: Question[];
  image?: Image;
  grid?: Grid;
}

interface Grid {
  rows: number;
  columns: number;
}

interface PageBreakItem {
  title?: string;
  description?: string;
}

interface TextItem {
  title?: string;
  description?: string;
}

interface ImageItem {
  image: Image;
}

interface VideoItem {
  video: Video;
  caption?: string;
}

// Questions
type Question =
  | ChoiceQuestion
  | TextQuestion
  | ScaleQuestion
  | DateQuestion
  | TimeQuestion
  | FileUploadQuestion
  | RowQuestion;

interface ChoiceQuestion {
  type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
  options: Option[];
  shuffle?: boolean;
}

interface TextQuestion {
  paragraph: boolean;
}

interface ScaleQuestion {
  low: number;
  high: number;
  lowLabel?: string;
  highLabel?: string;
}

interface DateQuestion {
  includeTime?: boolean;
  includeYear?: boolean;
}

interface TimeQuestion {
  duration?: boolean;
}

interface FileUploadQuestion {
  folderId: string;
  types: FileType[];
  maxFiles?: number;
  maxFileSize?: string;
}

interface RowQuestion {
  title: string;
}

// Additional types for questions and answers
interface Option {
  value: string;
  image?: Image;
  isOther?: boolean;
  goToAction?: GoToAction;
  goToSectionId?: string;
}

type Answer = TextAnswer | FileUploadAnswer;

interface TextAnswer {
  questionId: string;
  textAnswers?: TextAnswers;
}

interface FileUploadAnswer {
  questionId: string;
  fileUploadAnswers?: FileUploadAnswers;
}

interface TextAnswers {
  answers: string[]; // Assuming simple string values for text answers
}

interface FileUploadAnswers {
  answers: FileUploadAnswerDetail[];
}

interface FileUploadAnswerDetail {
  fileId: string;
  fileName: string;
  mimeType: string;
}

interface Image {
  contentUri?: string;
  altText?: string;
  sourceUri?: string;
}

interface Video {
  youtubeUri: string;
}

enum FileType {
  DOCUMENT,
  PRESENTATION,
  SPREADSHEET,
  PDF,
  IMAGE,
  VIDEO,
  AUDIO,
}

enum GoToAction {
  NEXT_SECTION,
  RESTART_FORM,
  SUBMIT_FORM,
}

