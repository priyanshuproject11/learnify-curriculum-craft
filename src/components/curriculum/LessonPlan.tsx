
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, CheckCircle, Clock, ListCheck, Copy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Unit, Lesson, Activity, LessonDuration, CompletionStatus } from "@/types/curriculum";
import ProgressTracker from "./ProgressTracker";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface LessonPlanProps {
  unit: Unit;
  onUpdateUnit: (updatedUnit: Unit) => void;
}

const LessonPlan = ({ unit, onUpdateUnit }: LessonPlanProps) => {
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState<LessonDuration>("45 mins");
  const [objective, setObjective] = useState("");
  const [activities, setActivities] = useState<Activity[]>([
    { id: uuidv4(), name: "Warm-up", completed: false },
    { id: uuidv4(), name: "Instruction", completed: false },
    { id: uuidv4(), name: "Practice", completed: false },
    { id: uuidv4(), name: "Assessment", completed: false },
  ]);
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [homework, setHomework] = useState("");
  const [aiQuizLink, setAiQuizLink] = useState("");
  
  const resetForm = () => {
    setTitle("");
    setDate(undefined);
    setDuration("45 mins");
    setObjective("");
    setActivities([
      { id: uuidv4(), name: "Warm-up", completed: false },
      { id: uuidv4(), name: "Instruction", completed: false },
      { id: uuidv4(), name: "Practice", completed: false },
      { id: uuidv4(), name: "Assessment", completed: false },
    ]);
    setMaterialsNeeded("");
    setHomework("");
    setAiQuizLink("");
    setIsAddingLesson(false);
  };
  
  const toggleActivity = (id: string) => {
    setActivities(
      activities.map(activity =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };
  
  const handleAddActivity = (name: string) => {
    if (!name.trim()) return;
    
    setActivities([
      ...activities,
      { id: uuidv4(), name, completed: false }
    ]);
  };
  
  const handleSubmit = () => {
    if (!title || !date || !objective) return;
    
    const newLesson: Lesson = {
      id: uuidv4(),
      title,
      date,
      duration,
      objective,
      activities,
      materialsNeeded,
      homework,
      aiQuizLink,
      status: "Planned",
    };
    
    onUpdateUnit({
      ...unit,
      lessons: [...unit.lessons, newLesson]
    });
    
    resetForm();
  };
  
  const handleDuplicate = (lessonId: string) => {
    const lessonToDuplicate = unit.lessons.find(lesson => lesson.id === lessonId);
    if (!lessonToDuplicate) return;
    
    const duplicatedLesson: Lesson = {
      ...lessonToDuplicate,
      id: uuidv4(),
      title: `${lessonToDuplicate.title} (Copy)`,
      activities: lessonToDuplicate.activities.map(activity => ({
        ...activity,
        id: uuidv4()
      }))
    };
    
    onUpdateUnit({
      ...unit,
      lessons: [...unit.lessons, duplicatedLesson]
    });
  };
  
  const deleteLesson = (lessonId: string) => {
    const updatedLessons = unit.lessons.filter(lesson => lesson.id !== lessonId);
    onUpdateUnit({
      ...unit,
      lessons: updatedLessons
    });
  };
  
  const updateLessonStatus = (lessonId: string, status: CompletionStatus, understanding?: number, remediation?: string) => {
    const updatedLessons = unit.lessons.map(lesson =>
      lesson.id === lessonId
        ? {
            ...lesson,
            status,
            ...(understanding !== undefined && { studentUnderstanding: understanding }),
            ...(remediation !== undefined && { remediation })
          }
        : lesson
    );
    
    onUpdateUnit({
      ...unit,
      lessons: updatedLessons
    });
  };
  
  const [activityName, setActivityName] = useState("");
  
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="lessons">
          <AccordionTrigger className="text-lg font-medium">
            Lessons ({unit.lessons.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Button 
                onClick={() => setIsAddingLesson(true)} 
                className="bg-lms-purple hover:bg-lms-purple/80 text-black"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Lesson
              </Button>
              
              {unit.lessons.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No lessons added yet</p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {unit.lessons.map(lesson => (
                    <div key={lesson.id} className="lms-card bg-white/70">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-medium">{lesson.title}</h4>
                            {lesson.status === "Planned" && (
                              <span className="lms-badge-blue">Planned</span>
                            )}
                            {lesson.status === "In Progress" && (
                              <span className="lms-badge-yellow">In Progress</span>
                            )}
                            {lesson.status === "Done" && (
                              <span className="lms-badge-green">Done</span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 space-x-4 mt-1">
                            <span className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(lesson.date), "PPP")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDuplicate(lesson.id)}
                            className="text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" /> Duplicate
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteLesson(lesson.id)}
                            className="text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h5 className="font-medium mb-1">Objective</h5>
                          <p className="text-sm">{lesson.objective}</p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Activities</h5>
                          <div className="flex flex-wrap gap-2">
                            {lesson.activities.map(activity => (
                              <span key={activity.id} className={`lms-badge ${activity.completed ? 'bg-lms-green' : 'bg-gray-100'}`}>
                                {activity.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-1">Materials Needed</h5>
                          <p className="text-sm">{lesson.materialsNeeded || "None specified"}</p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Homework/Assignments</h5>
                          <p className="text-sm">{lesson.homework || "None assigned"}</p>
                        </div>
                      </div>
                      
                      <ProgressTracker 
                        lesson={lesson}
                        onUpdateStatus={updateLessonStatus}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="lms-input-group">
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input 
                id="lesson-title" 
                placeholder="e.g. Introduction to Fractions" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="lms-input-group">
                <Label>Lesson Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="lms-input-group">
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={duration} 
                  onValueChange={(value) => setDuration(value as LessonDuration)}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 mins">30 mins</SelectItem>
                    <SelectItem value="45 mins">45 mins</SelectItem>
                    <SelectItem value="60 mins">60 mins</SelectItem>
                    <SelectItem value="90 mins">90 mins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="objective">Objective</Label>
              <Textarea 
                id="objective" 
                placeholder="What will students learn in this lesson?" 
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>
            
            <div className="lms-input-group">
              <Label>Activities</Label>
              <div className="space-y-2">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={activity.id} 
                      checked={activity.completed}
                      onCheckedChange={() => toggleActivity(activity.id)}
                    />
                    <Label htmlFor={activity.id} className="cursor-pointer">
                      {activity.name}
                    </Label>
                  </div>
                ))}
                
                <div className="flex mt-2">
                  <Input 
                    placeholder="Add custom activity" 
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    className="mr-2"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleAddActivity(activityName);
                      setActivityName("");
                    }}
                    disabled={!activityName.trim()}
                    className="whitespace-nowrap"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="materials">Materials Needed</Label>
              <Textarea 
                id="materials" 
                placeholder="List any materials required for this lesson" 
                value={materialsNeeded}
                onChange={(e) => setMaterialsNeeded(e.target.value)}
              />
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="homework">Homework/Assignments</Label>
              <Textarea 
                id="homework" 
                placeholder="Describe any homework or assignments" 
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
              />
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="ai-quiz">Link to AI Quiz or Flashcard (Optional)</Label>
              <Input 
                id="ai-quiz" 
                placeholder="e.g. https://example.com/quiz/123" 
                value={aiQuizLink}
                onChange={(e) => setAiQuizLink(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title || !date || !objective}
              className="bg-lms-purple hover:bg-lms-purple/80 text-black"
            >
              Add Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonPlan;
