import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Brain, 
  HelpCircle,
  FileText,
  Send,
  BookCheck,
  Plus,
  Image
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AIToolsPanelProps {
  highlightedText: string;
  currentPage: number;
  chapterTitle: string;
  subjectName: string;
  onClearHighlight: () => void;
}

const AIToolsPanel = ({
  highlightedText,
  currentPage,
  chapterTitle,
  subjectName,
  onClearHighlight
}: AIToolsPanelProps) => {
  const [activeTab, setActiveTab] = useState("ask");
  const [question, setQuestion] = useState("");
  const [helpQuestion, setHelpQuestion] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([ // NEW: actual flashcard state
    { front: "What is a real number?", back: "A value that represents a quantity along a continuous line." }
  ]);
  const [showAddFlashModal, setShowAddFlashModal] = useState(false);

  // --- Quiz logic ---
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: string }>({});
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number; explanations: string[] } | null>(null);

  // --- Help Q list ---
  const [helpQList, setHelpQList] = useState<string[]>([]);

  // --- Notes images ---
  const [noteImage, setNoteImage] = useState<File | null>(null);

  /*** Flashcards logic ***/
  // Create a flashcard from highlighted text
  const handleCreateFlashcardFromHighlight = () => {
    if (highlightedText) {
      setFlashcards([
        ...flashcards,
        { front: highlightedText, back: "Edit to add definition..." }
      ]);
      onClearHighlight();
    }
  };

  /*** Quiz logic ***/
  // For demonstration; more robust logic can be implemented
  const quizQuestions = subjectName === "Mathematics"
    ? [
        {
          question: "Which of the following is an irrational number?",
          options: ["22/7", "√4", "√3", "0.75"],
          answer: "√3",
          explanation: "√3 cannot be written as a ratio of two integers, hence it's an irrational number."
        },
        {
          question: "The decimal expansion of rational numbers is:",
          options: ["Always terminating", "Always non-terminating", "Either terminating or repeating non-terminating", "None of these"],
          answer: "Either terminating or repeating non-terminating",
          explanation: "Rational numbers can have either terminating or repeating decimal expansions."
        }
      ]
    : [
        {
          question: `What is 2 + 2?`,
          options: ["3", "4", "5", "22"],
          answer: "4",
          explanation: "2 plus 2 is 4."
        }
      ];

  const handleSelectQuizOption = (qIdx: number, opt: string) => {
    setSelectedAnswers(a => ({ ...a, [qIdx]: opt }));
  };
  const handleQuizSubmit = () => {
    let correct = 0;
    let explanations: string[] = [];
    quizQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correct++;
      explanations.push(
        selectedAnswers[i] === q.answer
          ? `Q${i + 1}: Correct. ${q.explanation}`
          : `Q${i + 1}: Incorrect. ${q.explanation}`
      );
    });
    setQuizSubmitted(true);
    setQuizResult({ correct, total: quizQuestions.length, explanations });
  };
  const handleQuizRetry = () => {
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  /*** Notes logic ***/
  const handleNoteAdd = () => {
    if (highlightedText || noteContent || noteImage) {
      // In real app you’d attach note to highlight/page with content/image
      console.log("Added note:", {
        highlight: highlightedText,
        content: noteContent,
        page: currentPage,
        image: noteImage,
      });
      setNoteContent("");
      setNoteImage(null);
      onClearHighlight();
    }
  };
  const handleNoteImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNoteImage(e.target.files[0]);
    }
  };

  /*** Help logic ***/
  const handleHelpSubmit = () => {
    if (helpQuestion.trim()) {
      setHelpQList(qs => [...qs, helpQuestion.trim()]);
      setHelpQuestion("");
    }
  };

  /** UI: AITools Panel header - neater, compact  **/ 
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-2 pb-1 bg-gray-50 border-b flex items-center justify-between gap-2">
        <div className="text-base font-semibold text-gray-700">
          <span>AI Tools</span>
        </div>
        <TabsList className="bg-transparent space-x-2 flex">
          <TabsTrigger value="flashcards" onClick={() => setActiveTab("flashcards")}>Flashcards</TabsTrigger>
          <TabsTrigger value="quiz" onClick={() => setActiveTab("quiz")}>Quiz</TabsTrigger>
          <TabsTrigger value="notes" onClick={() => setActiveTab("notes")}>Notes</TabsTrigger>
          <TabsTrigger value="help" onClick={() => setActiveTab("help")}>Help</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* FLASHCARDS */}
        {activeTab === "flashcards" && (
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="font-medium text-purple-700">Flashcards</div>
              {highlightedText && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCreateFlashcardFromHighlight}
                >+ From Highlight</Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {flashcards.length === 0 ? (
                <div className="text-gray-400">No flashcards yet.</div>
              ) : (
                flashcards.map((fc, idx) => (
                  <div key={idx} className="mb-4 border rounded-md overflow-hidden">
                    <div className="bg-purple-50 p-3 font-medium">{fc.front}</div>
                    <div className="p-3 bg-white text-sm">{fc.back}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeTab === "quiz" && (
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center border-b">
              <div className="font-medium text-green-700">Quiz</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {!quizSubmitted ? (
                <form onSubmit={(e) => {e.preventDefault(); handleQuizSubmit();}}>
                  {quizQuestions.map((q, idx) => (
                    <div key={idx} className="mb-6 border rounded p-3 bg-white">
                      <div className="font-semibold mb-2">{q.question}</div>
                      <div className="space-y-2">
                        {q.options.map(opt => (
                          <label key={opt} className="flex gap-2 items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`quiz-q${idx}`}
                              checked={selectedAnswers[idx] === opt}
                              onChange={() => handleSelectQuizOption(idx, opt)}
                              className="accent-green-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              ) : (
                <div>
                  <div className="mb-4 p-3 border rounded bg-green-50">
                    <span className="font-medium">{quizResult?.correct} / {quizResult?.total} correct</span>
                  </div>
                  <ul className="list-disc pl-6 mb-4 text-sm">
                    {quizResult?.explanations.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                  <Button variant="outline" onClick={handleQuizRetry}>Retry</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center border-b">
              <div className="font-medium text-orange-700">Notes</div>
            </div>
            <div className="flex-1 overflow-auto px-4 py-3">
              {highlightedText && (
                <div className="bg-yellow-50 p-2 rounded text-sm font-medium mb-4 border border-yellow-300">
                  Tagging note to highlighted text:
                  <div className="italic mt-1">"{highlightedText}"</div>
                </div>
              )}
              <Textarea
                placeholder="Write a note..."
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                className="min-h-[100px] bg-white"
              />
              <div className="mt-2 flex flex-row items-center gap-2">
                <label
                  htmlFor="note-image-upload"
                  className="cursor-pointer rounded border px-2 py-1 bg-blue-50 text-xs text-blue-800"
                >
                  Upload Image
                  <input
                    id="note-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleNoteImageChange}
                  />
                </label>
                {noteImage && (
                  <span className="text-xs text-green-800">{noteImage.name}</span>
                )}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button
                className="w-full"
                onClick={handleNoteAdd}
                disabled={!highlightedText && !noteContent && !noteImage}
              >Save Note</Button>
            </div>
          </div>
        )}

        {/* HELP */}
        {activeTab === "help" && (
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center border-b">
              <div className="font-medium text-red-700">Ask for Help</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {helpQList.length === 0 ? (
                <div className="text-gray-400">No questions yet.</div>
              ) : (
                <ul className="mb-3 list-disc pl-5 space-y-2 text-gray-700">
                  {helpQList.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              )}
              <Textarea
                placeholder="Type a question for your teacher..."
                value={helpQuestion}
                onChange={e => setHelpQuestion(e.target.value)}
                className="min-h-[60px] bg-white"
              />
              <Button
                className="mt-2 w-full"
                onClick={handleHelpSubmit}
                disabled={!helpQuestion.trim()}
              >Submit Question</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIToolsPanel;
