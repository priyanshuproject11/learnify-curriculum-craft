
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TextbookSearch from "@/components/textbook/TextbookSearch";
import AITutor from "@/components/textbook/AITutor";
import { DikshaTextbook } from "@/types/curriculum";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain } from "lucide-react";

const Resources = () => {
  const [selectedTextbook, setSelectedTextbook] = useState<DikshaTextbook | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <p className="text-gray-600 mt-2">
            Access digital textbooks and get personalized AI tutoring support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TextbookSearch onSelectTextbook={setSelectedTextbook} />
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
      </div>
    </div>
  );
};

export default Resources;

