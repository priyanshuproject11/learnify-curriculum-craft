
import { useState } from "react";
import { Curriculum } from "@/types/curriculum";
import Navbar from "@/components/Navbar";
import CurriculumForm from "@/components/curriculum/CurriculumForm";
import UnitPlanner from "@/components/curriculum/UnitPlanner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Book, FileText } from "lucide-react";

const Index = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);

  const handleCurriculumCreate = (newCurriculum: Curriculum) => {
    setCurriculum(newCurriculum);
    toast.success("Curriculum created successfully!");
  };

  const handleCurriculumUpdate = (updatedCurriculum: Curriculum) => {
    setCurriculum(updatedCurriculum);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Curriculum Planner</h1>
            <p className="text-gray-600">
              Create and manage your curriculum structure, units, and lessons
            </p>
          </div>
          
          {curriculum && (
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          )}
        </div>
        
        {!curriculum ? (
          <CurriculumForm onCurriculumCreate={handleCurriculumCreate} />
        ) : (
          <div>
            <div className="lms-card mb-6 bg-gradient-to-br from-lms-blue/40 to-lms-purple/40">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <Book className="h-5 w-5 mr-2 text-primary-foreground" />
                    <h2 className="text-xl font-bold">{curriculum.subject}</h2>
                  </div>
                  <div className="flex space-x-3 mt-2">
                    <span className="lms-badge-blue">{curriculum.boardType}</span>
                    <span className="lms-badge-green">Grade {curriculum.grade}</span>
                    <span className="lms-badge-purple">{curriculum.timeframe}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => setCurriculum(null)}
                >
                  Edit Curriculum
                </Button>
              </div>
            </div>
            
            <UnitPlanner 
              curriculum={curriculum}
              onUpdateCurriculum={handleCurriculumUpdate}
            />
          </div>
        )}
      </div>
      
      <footer className="mt-16 py-6 bg-white bg-opacity-70 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Learnify - AI-powered Learning Management System</p>
          <p className="text-sm mt-1">
            An innovative curriculum planning tool for K-12 educators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
