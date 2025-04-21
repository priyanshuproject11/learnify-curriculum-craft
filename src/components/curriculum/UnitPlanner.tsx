
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, FileText, Link, Video, Copy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Unit, Resource, Curriculum } from "@/types/curriculum";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import LessonPlan from "./LessonPlan";

interface UnitPlannerProps {
  curriculum: Curriculum;
  onUpdateCurriculum: (updatedCurriculum: Curriculum) => void;
}

const UnitPlanner = ({ curriculum, onUpdateCurriculum }: UnitPlannerProps) => {
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [objectives, setObjectives] = useState("");
  const [keyConcepts, setKeyConcepts] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState<Resource["type"]>("Link");
  
  const resetForm = () => {
    setUnitName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setObjectives("");
    setKeyConcepts("");
    setResources([]);
    setIsAddingUnit(false);
  };
  
  const addResource = () => {
    if (!resourceName || !resourceUrl) return;
    
    const newResource: Resource = {
      id: uuidv4(),
      name: resourceName,
      type: resourceType,
      url: resourceUrl
    };
    
    setResources([...resources, newResource]);
    setResourceName("");
    setResourceUrl("");
  };
  
  const handleSubmit = () => {
    if (!unitName || !startDate || !endDate || !objectives || !keyConcepts) return;
    
    const newUnit: Unit = {
      id: uuidv4(),
      name: unitName,
      startDate: startDate,
      endDate: endDate,
      objectives,
      keyConcepts,
      resources,
      lessons: []
    };
    
    const updatedCurriculum = {
      ...curriculum,
      units: [...curriculum.units, newUnit]
    };
    
    onUpdateCurriculum(updatedCurriculum);
    resetForm();
  };
  
  const handleDuplicate = (unitId: string) => {
    const unitToDuplicate = curriculum.units.find(unit => unit.id === unitId);
    if (!unitToDuplicate) return;
    
    const duplicatedUnit: Unit = {
      ...unitToDuplicate,
      id: uuidv4(),
      name: `${unitToDuplicate.name} (Copy)`,
      lessons: unitToDuplicate.lessons.map(lesson => ({
        ...lesson,
        id: uuidv4()
      }))
    };
    
    onUpdateCurriculum({
      ...curriculum,
      units: [...curriculum.units, duplicatedUnit]
    });
  };
  
  const deleteUnit = (unitId: string) => {
    const updatedUnits = curriculum.units.filter(unit => unit.id !== unitId);
    onUpdateCurriculum({
      ...curriculum,
      units: updatedUnits
    });
  };
  
  const updateUnit = (updatedUnit: Unit) => {
    const updatedUnits = curriculum.units.map(unit => 
      unit.id === updatedUnit.id ? updatedUnit : unit
    );
    
    onUpdateCurriculum({
      ...curriculum,
      units: updatedUnits
    });
  };
  
  const ResourceIcon = () => {
    switch (resourceType) {
      case "PDF":
        return <FileText className="h-4 w-4" />;
      case "PPT":
        return <FileText className="h-4 w-4" />;
      case "Video":
        return <Video className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Units</h2>
        <Button 
          onClick={() => setIsAddingUnit(true)} 
          className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Unit
        </Button>
      </div>
      
      {curriculum.units.length === 0 ? (
        <div className="lms-card text-center py-12">
          <p className="text-gray-500 mb-4">No units added yet</p>
          <Button 
            onClick={() => setIsAddingUnit(true)}
            className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" /> Add First Unit
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {curriculum.units.map(unit => (
            <div key={unit.id} className="lms-card bg-gradient-to-br from-lms-yellow/40 to-lms-peach/40">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{unit.name}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(unit.startDate), "PPP")} - {format(new Date(unit.endDate), "PPP")}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicate(unit.id)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Duplicate
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteUnit(unit.id)}
                    className="text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-1">Learning Objectives</h4>
                  <p className="text-sm bg-white/70 p-3 rounded-lg">{unit.objectives}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Key Concepts/Topics</h4>
                  <p className="text-sm bg-white/70 p-3 rounded-lg">{unit.keyConcepts}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Resources</h4>
                {unit.resources.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {unit.resources.map(resource => (
                      <a 
                        key={resource.id} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="lms-badge-blue flex items-center"
                      >
                        {resource.type === "PDF" && <FileText className="h-3 w-3 mr-1" />}
                        {resource.type === "PPT" && <FileText className="h-3 w-3 mr-1" />}
                        {resource.type === "Video" && <Video className="h-3 w-3 mr-1" />}
                        {resource.type === "Link" && <Link className="h-3 w-3 mr-1" />}
                        {resource.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No resources added</p>
                )}
              </div>
              
              <LessonPlan unit={unit} onUpdateUnit={updateUnit} />
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isAddingUnit} onOpenChange={setIsAddingUnit}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="lms-input-group">
              <Label htmlFor="unit-name">Unit Name</Label>
              <Input 
                id="unit-name" 
                placeholder="e.g. Algebraic Expressions" 
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="lms-input-group">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="lms-input-group">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea 
                id="objectives" 
                placeholder="List the key learning objectives for this unit" 
                className="min-h-[100px]"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
              />
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="key-concepts">Key Concepts/Topics</Label>
              <Textarea 
                id="key-concepts" 
                placeholder="List the main concepts and topics covered in this unit" 
                className="min-h-[100px]"
                value={keyConcepts}
                onChange={(e) => setKeyConcepts(e.target.value)}
              />
            </div>
            
            <div className="lms-input-group">
              <Label>Resources</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {resources.map((resource, index) => (
                  <div key={index} className="lms-badge-blue">
                    {resource.type === "PDF" && <FileText className="h-3 w-3 mr-1" />}
                    {resource.type === "PPT" && <FileText className="h-3 w-3 mr-1" />}
                    {resource.type === "Video" && <Video className="h-3 w-3 mr-1" />}
                    {resource.type === "Link" && <Link className="h-3 w-3 mr-1" />}
                    {resource.name}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-1">
                  <select 
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as Resource["type"])}
                  >
                    <option value="Link">Link</option>
                    <option value="PDF">PDF</option>
                    <option value="PPT">PPT</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="Resource name" 
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 flex">
                  <Input 
                    placeholder="URL/link" 
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="mr-2"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    onClick={addResource}
                    disabled={!resourceName || !resourceUrl}
                    className="whitespace-nowrap"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!unitName || !startDate || !endDate || !objectives || !keyConcepts}
              className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
            >
              Add Unit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitPlanner;
