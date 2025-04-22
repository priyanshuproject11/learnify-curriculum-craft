export type BoardType = "CBSE" | "ICSE" | "IB" | "State Board" | "Other";

export type Grade = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type TimeFrame = "Term" | "Quarter" | "Month";

export type LessonDuration = "30 mins" | "45 mins" | "60 mins" | "90 mins";

export type CompletionStatus = "Planned" | "In Progress" | "Done";

export interface Resource {
  id: string;
  name: string;
  type: "PDF" | "PPT" | "Link" | "Video";
  url: string;
}

export interface Activity {
  id: string;
  name: string;
  completed: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "Multiple Choice" | "Short Answer" | "Essay" | "True/False";
  options?: string[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: "Quiz" | "Test" | "Project" | "Presentation" | "Essay";
  date: Date | string;
  instructions?: string;
  timeLimit?: string;
  questions: AssessmentQuestion[];
  aiGenerated?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  date: Date | string;
  duration: LessonDuration;
  objective: string;
  activities: Activity[];
  materialsNeeded: string;
  homework: string;
  aiQuizLink?: string;
  status: CompletionStatus;
  studentUnderstanding?: number;
  remediation?: string;
}

export interface Unit {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  objectives: string;
  keyConcepts: string;
  resources: Resource[];
  lessons: Lesson[];
  estimatedTime?: string;
  assessment?: Assessment;
}

export interface Curriculum {
  id: string;
  boardType: BoardType;
  grade: Grade;
  subject: string;
  timeframe: TimeFrame;
  units: Unit[];
}

export interface DikshaCourse {
  identifier: string;
  name: string;
  description?: string;
  subject: string[];
  gradeLevel: string[];
  resourceType: string;
  mediaType: string;
  mimeType: string;
  contentType: string;
  objectType: string;
  board: string[];
  medium: string[];
}

export interface DikshaSearchResponse {
  id: string;
  ver: string;
  ts: string;
  params: {
    resmsgid: string;
    msgid: string;
    err: string | null;
    status: string;
    errmsg: string | null;
  };
  responseCode: string;
  result: {
    count: number;
    content: DikshaCourse[];
  };
}
