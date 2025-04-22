
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TextbookSearch from "@/components/textbook/TextbookSearch";
import AITutor from "@/components/textbook/AITutor";
import { DikshaTextbook } from "@/types/curriculum";

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
          
          {selectedTextbook && (
            <div className="lg:col-span-1">
              <AITutor textbook={selectedTextbook} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
