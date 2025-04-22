
import { useState } from "react";
import { Curriculum, Unit } from "@/types/curriculum";
import CurriculumForm from "@/components/curriculum/CurriculumForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnitEditor from "@/components/curriculum/UnitEditor";
import AssessmentEditor from "@/components/curriculum/AssessmentEditor";
import { Book, Plus, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DashboardViewProps {
  curriculum: Curriculum | null;
  onCurriculumCreate: (curriculum: Curriculum) => void;
  onCurriculumUpdate: (curriculum: Curriculum) => void;
}

const DashboardView = ({ curriculum, onCurriculumCreate, onCurriculumUpdate }: DashboardViewProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("Class 9A");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [selectedTerm, setSelectedTerm] = useState<string>("Term 1");
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);

  const handleAddUnit = () => {
    setIsAddingUnit(true);
  };

  const handleUnitSave = (unit: Unit) => {
    if (!curriculum) return;
    
    const updatedCurriculum = {
      ...curriculum,
      units: [...curriculum.units, unit]
    };
    
    onCurriculumUpdate(updatedCurriculum);
    setIsAddingUnit(false);
    toast.success("Unit added successfully!");
  };

  const handleEditUnit = (unit: Unit) => {
    setActiveUnit(unit);
  };
  
  const handleEditAssessment = (unit: Unit) => {
    setActiveUnit(unit);
    setIsEditingAssessment(true);
  };

  const handleAssessmentSave = (unit: Unit) => {
    if (!curriculum) return;
    
    const updatedUnits = curriculum.units.map(u => 
      u.id === unit.id ? unit : u
    );
    
    onCurriculumUpdate({
      ...curriculum,
      units: updatedUnits
    });
    
    setIsEditingAssessment(false);
    setActiveUnit(null);
    toast.success("Assessment updated successfully!");
  };

  const handleGenerateContent = (unitId: string) => {
    toast.success("AI is generating content suggestions for this unit");
    // In a real implementation, this would call an API to generate content
  };
  
  // Mock classes and subjects for the demo
  const classes = ["Class 9A", "Class 9B", "Class 10A", "Class 10B"];
  const subjects = ["Mathematics", "Science", "English", "History"];
  const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];

  return (
    <div className="space-y-6">
      {!curriculum ? (
        <CurriculumForm onCurriculumCreate={onCurriculumCreate} />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">{selectedTerm} Curriculum Units</h2>
            <Button 
              className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
              onClick={handleAddUnit}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Unit
            </Button>
          </div>
          
          {curriculum.units.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">No units added yet</p>
                <Button 
                  className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
                  onClick={handleAddUnit}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add First Unit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {curriculum.units.map((unit) => (
                <Card key={unit.id} className="bg-gradient-to-br from-lms-blue/30 to-lms-purple/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-9">
                        <div className="flex items-center">
                          <Book className="h-5 w-5 mr-2 text-lms-blue" />
                          <h3 className="text-lg font-bold">{unit.name}</h3>
                          <Badge variant="outline" className="ml-3 bg-white/60">
                            {unit.estimatedTime || "2 weeks"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Topics & Subtopics</h4>
                            <p className="text-sm bg-white/80 p-3 rounded-lg min-h-20">
                              {unit.keyConcepts}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Learning Objectives</h4>
                            <p className="text-sm bg-white/80 p-3 rounded-lg min-h-20">
                              {unit.objectives}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">Resources</h4>
                          <div className="flex flex-wrap gap-2">
                            {unit.resources && unit.resources.length > 0 ? (
                              unit.resources.map((resource) => (
                                <a 
                                  key={resource.id} 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs bg-white/60 rounded-full px-3 py-1 flex items-center"
                                >
                                  {resource.type === "PDF" && <FileText className="h-3 w-3 mr-1" />}
                                  {resource.type === "Video" && <BookOpen className="h-3 w-3 mr-1" />}
                                  {resource.name}
                                </a>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">No resources added</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">Assessment</h4>
                          <p className="text-xs bg-white/80 p-3 rounded-lg">
                            {unit.assessment ? unit.assessment.title : "No assessment linked"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-3 flex flex-col space-y-2 lg:border-l lg:border-white/30 lg:pl-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-left bg-white/60 hover:bg-white"
                          onClick={() => handleEditUnit(unit)}
                        >
                          <Book className="h-4 w-4 mr-2" />
                          Edit Unit
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-left bg-white/60 hover:bg-white"
                          onClick={() => handleEditAssessment(unit)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Edit Assessment
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-left bg-lms-purple/20 hover:bg-lms-purple/40"
                          onClick={() => handleGenerateContent(unit.id)}
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5749C2.02502 13.8073 2.21269 13.9949 2.44503 13.9949C2.67736 13.9949 2.86502 13.8073 2.86502 13.5749C2.86502 11.8854 3.31568 10.6764 4.07077 9.92324C4.82298 9.17301 5.91298 8.77501 7.49996 8.77501C9.08694 8.77501 10.1769 9.17301 10.9292 9.92324C11.6842 10.6764 12.1349 11.8854 12.1349 13.5749C12.1349 13.8073 12.3226 13.9949 12.5549 13.9949C12.7872 13.9949 12.9749 13.8073 12.9749 13.5749C12.9749 11.72 12.4778 10.2794 11.4959 9.31167C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.625 4.5C4.625 2.91228 5.91228 1.625 7.5 1.625C9.08772 1.625 10.375 2.91228 10.375 4.5C10.375 6.08772 9.08772 7.375 7.5 7.375C5.91228 7.375 4.625 6.08772 4.625 4.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Generate Content
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Unit Editor Dialog */}
          <Dialog open={isAddingUnit || activeUnit !== null && !isEditingAssessment} 
                 onOpenChange={(open) => {
                   if (!open) {
                     setIsAddingUnit(false);
                     setActiveUnit(null);
                   }
                 }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{isAddingUnit ? "Add New Unit" : "Edit Unit"}</DialogTitle>
              </DialogHeader>
              
              <UnitEditor 
                unit={activeUnit} 
                onSave={handleUnitSave} 
                onCancel={() => {
                  setIsAddingUnit(false);
                  setActiveUnit(null);
                }}
              />
            </DialogContent>
          </Dialog>
          
          {/* Assessment Editor Dialog */}
          <Dialog open={isEditingAssessment} 
                 onOpenChange={(open) => {
                   if (!open) {
                     setIsEditingAssessment(false);
                     setActiveUnit(null);
                   }
                 }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Assessment</DialogTitle>
              </DialogHeader>
              
              <AssessmentEditor 
                unit={activeUnit}
                onSave={handleAssessmentSave}
                onCancel={() => {
                  setIsEditingAssessment(false);
                  setActiveUnit(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
