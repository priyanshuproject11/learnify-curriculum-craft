import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TextbookViewerProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  chapterId: string;
  highlightedText: string;
}

interface Note {
  id: string;
  page: number;
  highlight: string;
  content: string;
  timestamp: Date;
}

const TextbookViewer = ({ 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage,
  chapterId,
  highlightedText
}: TextbookViewerProps) => {
  const [scale, setScale] = useState(1);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Mock notes for demonstration
  useEffect(() => {
    // This would fetch from an API in a real app
    setNotes([
      {
        id: 'note-1',
        page: 1,
        highlight: 'Real numbers include both rational and irrational numbers',
        content: 'Remember: All rational and irrational numbers are real numbers',
        timestamp: new Date()
      },
      {
        id: 'note-2',
        page: 1,
        highlight: 'continuous line',
        content: 'The number line represents all real numbers',
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // Mock content - this would be replaced with actual textbook content
  const getMockContent = (chapterId: string, page: number) => {
    if (chapterId.startsWith("math")) {
      const content = `In this chapter, we will learn about real numbers, their properties, 
        and operations. Real numbers include both rational and irrational numbers.
        
        Definition: A real number is a value that represents a quantity along a continuous line.
        
        The set of real numbers, denoted by R, includes:
        • Natural numbers (N): 1, 2, 3, ...
        • Whole numbers (W): 0, 1, 2, 3, ...
        • Integers (Z): ..., -2, -1, 0, 1, 2, ...
        • Rational numbers (Q): Numbers that can be expressed as p/q where p, q are integers and q ≠ 0
        • Irrational numbers: Numbers that cannot be expressed as p/q (e.g., √2, π)
        
        Example: √2 is an irrational number because it cannot be expressed as a ratio of integers.`;
      
      return highlightContentWithNotes(content, notes.filter(note => note.page === currentPage));
    }
    
    if (chapterId.startsWith("sci")) {
      return (
        <div>
          <h3 className="text-xl font-bold mb-4">Chemical Reactions and Equations</h3>
          <p className="mb-3">
            Chemical reactions involve the transformation of substances into new substances 
            with different properties.
          </p>
          <div className="bg-green-50 p-3 border-l-4 border-green-500 mb-3">
            <h4 className="font-medium">Balanced Chemical Equation</h4>
            <p>A balanced chemical equation has the same number of atoms of each element on both sides.</p>
          </div>
          <p className="mb-3">
            Examples of chemical reactions in our daily life:
          </p>
          <ul className="list-disc pl-5 mb-3">
            <li>Rusting of iron</li>
            <li>Burning of fuels</li>
            <li>Photosynthesis in plants</li>
            <li>Digestion of food</li>
          </ul>
          <div className="bg-purple-50 p-3 border-l-4 border-purple-500">
            <p className="font-mono">2H₂ + O₂ → 2H₂O</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Content for {chapterId} - Page {page}</p>
      </div>
    );
  };
  
  const highlightContentWithNotes = (content: string, pageNotes: Note[]) => {
    let highlightedContent = <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Real Numbers</h3>
      
      {pageNotes.length > 0 ? (
        content.split('\n\n').map((paragraph, index) => {
          const paragraphWithHighlights = pageNotes.reduce((acc: React.ReactNode[], note) => {
            if (paragraph.includes(note.highlight)) {
              const parts = paragraph.split(note.highlight);
              const result: React.ReactNode[] = [];
              
              parts.forEach((part, i) => {
                if (part) {
                  result.push(part);
                }
                
                if (i < parts.length - 1) {
                  result.push(
                    <HoverCard key={`highlight-${note.id}-${i}`}>
                      <HoverCardTrigger asChild>
                        <span className="bg-yellow-200 px-1 py-0.5 rounded cursor-help">
                          {note.highlight}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 bg-white p-3 shadow-lg">
                        <div className="space-y-2">
                          <div className="font-medium">Note:</div>
                          <p className="text-sm">{note.content}</p>
                          <div className="text-xs text-gray-500">
                            {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                }
              });
              
              return result;
            }
            
            return [paragraph];
          }, []);
          
          if (index === 0) {
            return <p key={index} className="mb-3">{paragraphWithHighlights}</p>;
          } else if (index === 1) {
            return (
              <div key={index} className="bg-blue-50 p-3 border-l-4 border-blue-500 mb-3">
                <h4 className="font-medium">Definition</h4>
                <p>{paragraphWithHighlights}</p>
              </div>
            );
          } else if (index === 2) {
            return <p key={index} className="mb-3">{paragraphWithHighlights}</p>;
          } else if (index === 3) {
            return (
              <ul key={index} className="list-disc pl-5 mb-3">
                {paragraph.split('•').filter(Boolean).map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            );
          } else {
            return (
              <div key={index} className="bg-yellow-50 p-3 border-l-4 border-yellow-500">
                <h4 className="font-medium">Example</h4>
                <p>{paragraphWithHighlights}</p>
              </div>
            );
          }
        })
      ) : (
        content.split('\n\n').map((paragraph, index) => {
          if (index === 0) {
            return <p key={index} className="mb-3">{paragraph}</p>;
          } else if (index === 1) {
            return (
              <div key={index} className="bg-blue-50 p-3 border-l-4 border-blue-500 mb-3">
                <h4 className="font-medium">Definition</h4>
                <p>{paragraph}</p>
              </div>
            );
          } else if (index === 2) {
            return <p key={index} className="mb-3">{paragraph}</p>;
          } else if (index === 3) {
            return (
              <ul key={index} className="list-disc pl-5 mb-3">
                {paragraph.split('•').filter(Boolean).map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            );
          } else {
            return (
              <div key={index} className="bg-yellow-50 p-3 border-l-4 border-yellow-500">
                <h4 className="font-medium">Example</h4>
                <p>{paragraph}</p>
              </div>
            );
          }
        })
      )}
    </div>;
    
    return highlightedContent;
  };
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.8));
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm px-2">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.8}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 1.5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div 
          className="border rounded-md p-6 bg-white flex-1 overflow-auto"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            transformBox: 'border-box',
            transition: 'transform 0.2s'
          }}
        >
          {getMockContent(chapterId, currentPage)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextbookViewer;
