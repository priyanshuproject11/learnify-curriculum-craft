
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface TextbookViewerProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  chapterId: string;
}

const TextbookViewer = ({ 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage,
  chapterId 
}: TextbookViewerProps) => {
  const [scale, setScale] = useState(1);
  
  // Mock content - this would be replaced with actual textbook content
  const getMockContent = (chapterId: string, page: number) => {
    if (chapterId.startsWith("math")) {
      return (
        <div>
          <h3 className="text-xl font-bold mb-4">Real Numbers</h3>
          <p className="mb-3">
            In this chapter, we will learn about real numbers, their properties, 
            and operations. Real numbers include both rational and irrational numbers.
          </p>
          <div className="bg-blue-50 p-3 border-l-4 border-blue-500 mb-3">
            <h4 className="font-medium">Definition</h4>
            <p>A real number is a value that represents a quantity along a continuous line.</p>
          </div>
          <p className="mb-3">
            The set of real numbers, denoted by R, includes:
          </p>
          <ul className="list-disc pl-5 mb-3">
            <li>Natural numbers (N): 1, 2, 3, ...</li>
            <li>Whole numbers (W): 0, 1, 2, 3, ...</li>
            <li>Integers (Z): ..., -2, -1, 0, 1, 2, ...</li>
            <li>Rational numbers (Q): Numbers that can be expressed as p/q where p, q are integers and q ≠ 0</li>
            <li>Irrational numbers: Numbers that cannot be expressed as p/q (e.g., √2, π)</li>
          </ul>
          <div className="bg-yellow-50 p-3 border-l-4 border-yellow-500">
            <h4 className="font-medium">Example</h4>
            <p>√2 is an irrational number because it cannot be expressed as a ratio of integers.</p>
          </div>
        </div>
      );
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
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.8));
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
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
          className="border rounded-md p-6 bg-white min-h-[60vh]"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
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
