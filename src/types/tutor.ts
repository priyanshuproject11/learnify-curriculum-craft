
export interface TutorMode {
  mode: 'explain' | 'question' | 'help' | 'practice';
  label: string;
  description: string;
}

export interface TutorResponse {
  content: string;
  type: 'text' | 'example' | 'visualization';
  relatedConcepts?: string[];
}
