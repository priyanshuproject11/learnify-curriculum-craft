import { useState } from "react";
import { Curriculum } from "@/types/curriculum";
import { searchDikshaCourses, convertDikshaCourseToUnit } from "@/services/diksha";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardView from "@/components/curriculum/DashboardView";
import CalendarView from "@/components/curriculum/CalendarView";
import ProgressView from "@/components/curriculum/ProgressView";
import { toast } from "sonner";
import { Book, FileText, Calendar, BarChart, Share2, Download } from "lucide-react";

const Index = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeView, setActiveView] = useState<string>("dashboard");

  const handleCurriculumCreate = (newCurriculum: Curriculum) => {
    setCurriculum(newCurriculum);
    toast.success("Curriculum created successfully!");
  };

  const handleCurriculumUpdate = (updatedCurriculum: Curriculum) => {
    setCurriculum(updatedCurriculum);
  };

  const handleExportPDF = () => {
    toast.success("Curriculum exported as PDF");
  };

  const handleShare = () => {
    toast.success("Curriculum shared with colleagues");
  };

  const handleImportDiksha = async (curriculum: Curriculum | null) => {
    if (!curriculum) {
      toast.error("Please create a curriculum first");
      return;
    }

    if (curriculum.boardType !== "CBSE") {
      toast.error("DIKSHA import is only available for CBSE curriculum");
      return;
    }

    try {
      toast.info("Fetching CBSE content from DIKSHA...");
      const courses = await searchDikshaCourses(
        "CBSE",
        curriculum.grade,
        curriculum.subject
      );

      if (courses.length === 0) {
        toast.warning("No matching content found in DIKSHA");
        return;
      }

      const units = courses.map(convertDikshaCourseToUnit);
      const updatedCurriculum = {
        ...curriculum,
        units: [...curriculum.units, ...units]
      };

      handleCurriculumUpdate(updatedCurriculum);
      toast.success(`Imported ${units.length} units from DIKSHA`);
    } catch (error) {
      toast.error("Failed to import DIKSHA content");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Curriculum Planner</h1>
            <p className="text-gray-600">
              Create, manage, and track your curriculum structure, units, and assessments
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="flex items-center" onClick={() => handleImportDiksha(curriculum)}>
              <Download className="h-4 w-4 mr-2" />
              Import DIKSHA
            </Button>
            <Button variant="outline" className="flex items-center" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center justify-center">
              <Book className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center justify-center">
              <BarChart className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <DashboardView 
              curriculum={curriculum} 
              onCurriculumCreate={handleCurriculumCreate}
              onCurriculumUpdate={handleCurriculumUpdate}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarView curriculum={curriculum} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6">
            <ProgressView curriculum={curriculum} />
          </TabsContent>
        </Tabs>
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
