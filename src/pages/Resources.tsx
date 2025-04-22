
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TextbookSearch from "@/components/textbook/TextbookSearch";
import AITutor from "@/components/textbook/AITutor";
import { DikshaTextbook } from "@/types/curriculum";
import PDFViewer from "@/components/textbook/PDFViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Resources = () => {
  const [selectedTextbook, setSelectedTextbook] = useState<DikshaTextbook | null>(null);

  const handleTextbookSelect = (textbook: DikshaTextbook) => {
    setSelectedTextbook(textbook);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-2">
        {!selectedTextbook ? (
          <>
            <h1 className="text-xl font-medium mb-3">NCERT Resources</h1>
            <TextbookSearch onSelectTextbook={handleTextbookSelect} />
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTextbook(null)}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-lg font-medium truncate">{selectedTextbook.name}</h2>
            </div>

            <div className="grid grid-cols-5 gap-4 h-[calc(100vh-8rem)]">
              {/* PDF Viewer - 2/5 width */}
              <div className="col-span-2 bg-white rounded-lg shadow-sm">
                <ScrollArea className="h-full">
                  {selectedTextbook.pdfUrl && (
                    <PDFViewer url={selectedTextbook.pdfUrl} />
                  )}
                </ScrollArea>
              </div>
              
              {/* AI Tutor - 3/5 width */}
              <div className="col-span-3 bg-white rounded-lg shadow-sm">
                <ScrollArea className="h-full">
                  <AITutor textbook={selectedTextbook} />
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
