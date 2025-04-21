
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
}

export interface Curriculum {
  id: string;
  boardType: BoardType;
  grade: Grade;
  subject: string;
  timeframe: TimeFrame;
  units: Unit[];
}
