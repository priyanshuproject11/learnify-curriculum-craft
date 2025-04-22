
import { TutorMode } from "@/types/tutor";

export const TUTOR_MODES: TutorMode[] = [
  {
    mode: 'explain',
    label: 'Explain Page',
    description: "I'll help explain the current page content step by step with examples and clear explanations.",
    icon: 'book'
  },
  {
    mode: 'question',
    label: 'Ask Question',
    description: "Ask me any question about the current topic or related concepts.",
    icon: 'help-circle'
  },
  {
    mode: 'help',
    label: 'Need Help?',
    description: "I'll break down complex concepts with visual explanations and analogies.",
    icon: 'brain'
  },
  {
    mode: 'practice',
    label: 'Try Example',
    description: "Let's solve practice problems together to reinforce your understanding.",
    icon: 'file-plus'
  }
];

