
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
      
      <div className="container mx-auto px-4 py-4">
        {!selectedTextbook ? (
          <>
            <h1 className="text-2xl font-bold mb-4">NCERT Resources</h1>
            <TextbookSearch onSelectTextbook={handleTextbookSelect} />
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTextbook(null)}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Button>
              <h2 className="text-lg font-medium">{selectedTextbook.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
              <div className="bg-white rounded-lg shadow-sm">
                <ScrollArea className="h-full">
                  {selectedTextbook.pdfUrl && (
                    <PDFViewer url={selectedTextbook.pdfUrl} />
                  )}
                </ScrollArea>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm">
                <ScrollArea className="h-full p-4">
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
