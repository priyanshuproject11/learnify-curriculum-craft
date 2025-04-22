
export interface TutorMode {
  mode: 'explain' | 'question' | 'help' | 'practice';
  label: string;
  description: string;
  icon: 'book' | 'help-circle' | 'brain' | 'file-plus';
}

export interface TutorResponse {
  content: string;
  type: 'text' | 'example' | 'visualization';
  relatedConcepts?: string[];
}

export interface TutorQuestion {
  question: string;
  timestamp: Date;
  mode: TutorMode['mode'];
}

export interface AITutorContext {
  currentPage?: string;
  currentTopic?: string;
  gradeLevel: string;
  subject: string;
}

