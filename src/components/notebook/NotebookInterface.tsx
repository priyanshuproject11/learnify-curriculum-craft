import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TextbookViewer from "@/components/notebook/TextbookViewer";
import AIToolsPanel from "@/components/notebook/AIToolsPanel";
import RevisionSuggestion from "@/components/notebook/RevisionSuggestion";
import { Input } from "@/components/ui/input";

interface NotebookInterfaceProps {
  subjectId: string;
  classLevel: string;
}

// Sample chapters for each subject (would be fetched from API/database)
const SAMPLE_CHAPTERS = {
  "mathematics": [
    { id: "math-1", title: "Real Numbers", pages: 18 },
    { id: "math-2", title: "Polynomials", pages: 22 },
    { id: "math-3", title: "Pair of Linear Equations in Two Variables", pages: 24 }
  ],
  "science": [
    { id: "sci-1", title: "Chemical Reactions and Equations", pages: 15 },
    { id: "sci-2", title: "Acids, Bases and Salts", pages: 20 },
    { id: "sci-3", title: "Metals and Non-metals", pages: 18 }
  ],
  "social-studies": [
    { id: "ss-1", title: "Development", pages: 16 },
    { id: "ss-2", title: "Sectors of Indian Economy", pages: 18 },
    { id: "ss-3", title: "Money and Credit", pages: 20 }
  ],
  "english": [
    { id: "eng-1", title: "A Letter to God", pages: 14 },
    { id: "eng-2", title: "Nelson Mandela: Long Walk to Freedom", pages: 16 },
    { id: "eng-3", title: "Two Stories about Flying", pages: 12 }
  ],
  "hindi": [
    { id: "hin-1", title: "कबीर (Kabir)", pages: 16 },
    { id: "hin-2", title: "मीरा (Meera)", pages: 14 },
    { id: "hin-3", title: "बिहारी (Bihari)", pages: 15 }
  ]
};

// Get the subject name from ID
const getSubjectName = (subjectId: string): string => {
  switch (subjectId) {
    case "mathematics": return "Mathematics";
    case "science": return "Science";
    case "social-studies": return "Social Studies";
    case "english": return "English";
    case "hindi": return "Hindi";
    default: return "Subject";
  }
};

const NotebookInterface = ({ subjectId, classLevel }: NotebookInterfaceProps) => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedText, setHighlightedText] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Load chapters for the selected subject
    setChapters(SAMPLE_CHAPTERS[subjectId as keyof typeof SAMPLE_CHAPTERS] || []);
    
    // Reset selected chapter when subject changes
    setSelectedChapter(null);
  }, [subjectId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setHighlightedText(selection.toString());
    }
  };

  const handleNextPage = () => {
    if (selectedChapter) {
      const chapter = chapters.find(c => c.id === selectedChapter);
      if (chapter && currentPage < chapter.pages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-3 h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/notebook">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-medium">
            {classLevel}: {getSubjectName(subjectId)}
          </h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>
      
      {isSearchOpen && (
        <div className="mb-2">
          <Input 
            placeholder="Search within textbooks..." 
            className="max-w-md" 
          />
        </div>
      )}
      
      {!selectedChapter ? (
        <div>
          <div className="mb-2 flex w-full">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search within textbooks..."
              className="max-w-xl w-full rounded-lg border-2 border-blue-100 shadow-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
            {chapters.map((chapter) => (
              <Card 
                key={chapter.id} 
                className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setSelectedChapter(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{chapter.title}</h3>
                    <p className="text-sm text-gray-500">
                      {chapter.pages} pages
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedChapter(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              All Chapters
            </Button>
            <h2 className="text-md font-medium">
              {chapters.find(c => c.id === selectedChapter)?.title}
            </h2>
          </div>
          
          <div className="mb-2 flex w-full">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search within this chapter..."
              className="max-w-xl w-full rounded-lg border-2 border-blue-100 shadow-none"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow overflow-hidden" style={{height: "100%"}}>
            <div className="lg:col-span-8 h-full">
              <TextbookViewer 
                currentPage={currentPage}
                totalPages={chapters.find(c => c.id === selectedChapter)?.pages || 1}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                chapterId={selectedChapter}
                highlightedText={highlightedText}
              />
            </div>
            
            <div className="lg:col-span-4 h-full">
              <AIToolsPanel 
                highlightedText={highlightedText} 
                currentPage={currentPage}
                chapterTitle={chapters.find(c => c.id === selectedChapter)?.title || ""}
                subjectName={getSubjectName(subjectId)}
                onClearHighlight={() => setHighlightedText("")}
              />
            </div>
          </div>
          
          <div className="mt-2">
            <RevisionSuggestion />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookInterface;
