
export interface Chapter {
  id: string;
  title: string;
  pages: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  textColor: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Note {
  id: string;
  page: number;
  highlight?: string;
  content: string;
  timestamp: Date;
}

export interface RevisionSuggestion {
  title: string;
  description: string;
  link: string;
}
