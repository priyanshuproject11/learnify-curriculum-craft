
import { useState, useEffect } from "react";
import { Unit, Resource } from "@/types/curriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, FileText, Link, Video, BookOpen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnitEditorProps {
  unit: Unit | null;
  onSave: (unit: Unit) => void;
  onCancel: () => void;
}

const UnitEditor = ({ unit, onSave, onCancel }: UnitEditorProps) => {
  const [unitTitle, setUnitTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [objectives, setObjectives] = useState<string>("");
  const [keyConcepts, setKeyConcepts] = useState<string>("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceName, setResourceName] = useState<string>("");
  const [resourceUrl, setResourceUrl] = useState<string>("");
  const [resourceType, setResourceType] = useState<Resource["type"]>("Link");
  const [estimatedTime, setEstimatedTime] = useState<string>("2 weeks");
  
  useEffect(() => {
    if (unit) {
      setUnitTitle(unit.name);
      setStartDate(new Date(unit.startDate));
      setEndDate(new Date(unit.endDate));
      setObjectives(unit.objectives);
      setKeyConcepts(unit.keyConcepts);
      setResources(unit.resources || []);
      setEstimatedTime(unit.estimatedTime || "2 weeks");
    }
  }, [unit]);
  
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
  
  const removeResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
  };
  
  const handleSubmit = () => {
    if (!unitTitle || !startDate || !endDate || !objectives || !keyConcepts) return;
    
    const newUnit: Unit = {
      id: unit?.id || uuidv4(),
      name: unitTitle,
      startDate: startDate,
      endDate: endDate,
      objectives,
      keyConcepts,
      resources,
      estimatedTime,
      lessons: unit?.lessons || [],
      assessment: unit?.assessment || undefined
    };
    
    onSave(newUnit);
  };
  
  const timeOptions = [
    "1 week", "2 weeks", "3 weeks", "4 weeks", "5 weeks", 
    "6 weeks", "1 month", "2 months", "Half semester", "Full semester"
  ];
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="unit-title">Unit Title</Label>
        <Input 
          id="unit-title" 
          placeholder="e.g. Algebraic Expressions" 
          value={unitTitle}
          onChange={(e) => setUnitTitle(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="estimated-time">Estimated Time</Label>
        <Select value={estimatedTime} onValueChange={setEstimatedTime}>
          <SelectTrigger id="estimated-time">
            <SelectValue placeholder="Select estimated time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>{time}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key-concepts">Topics & Subtopics</Label>
        <Textarea 
          id="key-concepts" 
          placeholder="List the main topics and subtopics covered in this unit" 
          className="min-h-[100px]"
          value={keyConcepts}
          onChange={(e) => setKeyConcepts(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="objectives">Learning Objectives</Label>
        <Textarea 
          id="objectives" 
          placeholder="List the key learning objectives for this unit" 
          className="min-h-[100px]"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Resources</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-lms-blue/20 rounded-full px-3 py-1 flex items-center"
              onClick={() => removeResource(resource.id)}
            >
              {resource.type === "PDF" && <FileText className="h-3 w-3 mr-1" />}
              {resource.type === "PPT" && <FileText className="h-3 w-3 mr-1" />}
              {resource.type === "Video" && <Video className="h-3 w-3 mr-1" />}
              {resource.type === "Link" && <Link className="h-3 w-3 mr-1" />}
              <span className="text-sm">{resource.name}</span>
              <span className="ml-2 text-xs cursor-pointer">✕</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2">
            <Select value={resourceType} onValueChange={setResourceType as any}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Link">Link</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            <Input 
              placeholder="Resource name" 
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
            />
          </div>
          <div className="col-span-5">
            <Input 
              placeholder="URL/link" 
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addResource}
              disabled={!resourceName || !resourceUrl}
              className="w-full"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!unitTitle || !startDate || !endDate || !objectives || !keyConcepts}
          className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
        >
          {unit ? "Update Unit" : "Add Unit"}
        </Button>
      </div>
    </div>
  );
};

export default UnitEditor;
