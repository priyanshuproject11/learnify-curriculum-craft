
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TextbookSearch from "@/components/textbook/TextbookSearch";
import AITutor from "@/components/textbook/AITutor";
import { DikshaTextbook } from "@/types/curriculum";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import PDFViewer from "@/components/textbook/PDFViewer";

const Resources = () => {
  const [selectedTextbook, setSelectedTextbook] = useState<DikshaTextbook | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleTextbookSelect = (textbook: DikshaTextbook) => {
    setSelectedTextbook(textbook);
    
    // If the textbook has a PDF URL, set it for the viewer
    if (textbook.pdfUrl) {
      setPdfUrl(textbook.pdfUrl);
    } else {
      setPdfUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <p className="text-gray-600 mt-2">
            Access NCERT textbooks and get personalized AI tutoring support
          </p>
        </div>

        <Tabs defaultValue="textbooks">
          <TabsList className="mb-6">
            <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            <TabsTrigger value="videos">Video Lessons</TabsTrigger>
            <TabsTrigger value="practice">Practice Materials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="textbooks">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TextbookSearch onSelectTextbook={handleTextbookSelect} />
                
                {pdfUrl && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">PDF Viewer</h3>
                      <div className="flex gap-2">
                        <button 
                          className="text-sm text-blue-500 hover:underline"
                          onClick={() => window.open(pdfUrl, "_blank")}
                        >
                          Open in New Tab
                        </button>
                        <button 
                          className="text-sm text-gray-500 hover:underline"
                          onClick={() => setPdfUrl(null)}
                        >
                          Close Viewer
                        </button>
                      </div>
                    </div>
                    <div className="aspect-[3/4] w-full border rounded overflow-hidden p-4 bg-white">
                      <ScrollArea className="h-full">
                        <PDFViewer url={pdfUrl} />
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                {selectedTextbook ? (
                  <AITutor textbook={selectedTextbook} />
                ) : (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertTitle>Select a textbook to start</AlertTitle>
                    <AlertDescription>
                      Choose a textbook from the list to begin your personalized learning experience with AI tutoring support.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="text-center py-12 bg-white/50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-medium">Video Lessons Coming Soon</h3>
              <p className="text-gray-500 mt-2">
                Educational video content will be available in a future update.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="practice">
            <div className="text-center py-12 bg-white/50 rounded-lg border border-gray-100">
              <h3 className="text-xl font-medium">Practice Materials Coming Soon</h3>
              <p className="text-gray-500 mt-2">
                Practice worksheets, quizzes and interactive exercises will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;
