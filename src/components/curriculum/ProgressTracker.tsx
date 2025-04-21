
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lesson, CompletionStatus } from "@/types/curriculum";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ProgressTrackerProps {
  lesson: Lesson;
  onUpdateStatus: (
    lessonId: string, 
    status: CompletionStatus, 
    understanding?: number,
    remediation?: string
  ) => void;
}

const ProgressTracker = ({ lesson, onUpdateStatus }: ProgressTrackerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<CompletionStatus>(lesson.status);
  const [understanding, setUnderstanding] = useState<number>(lesson.studentUnderstanding ?? 70);
  const [remediation, setRemediation] = useState<string>(lesson.remediation ?? "");
  
  const handleSave = () => {
    onUpdateStatus(lesson.id, status, understanding, remediation);
    setIsOpen(false);
  };
  
  return (
    <div className="border-t pt-3">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-center items-center bg-opacity-50"
          >
            Update Progress
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Progress for "{lesson.title}"</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="lms-input-group">
              <Label htmlFor="status">Completion Status</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as CompletionStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-lms-blue mr-2"></span>
                      Planned
                    </div>
                  </SelectItem>
                  <SelectItem value="In Progress">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-lms-yellow mr-2"></span>
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="Done">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-lms-green mr-2"></span>
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="lms-input-group">
              <div className="flex justify-between items-center mb-2">
                <Label>Student Understanding</Label>
                <span className="text-sm font-medium">
                  {understanding}%
                </span>
              </div>
              <Slider
                defaultValue={[understanding]}
                max={100}
                step={5}
                onValueChange={(values) => setUnderstanding(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Needs Review</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="lms-input-group">
              <Label htmlFor="remediation">Suggested Remediation</Label>
              <Textarea 
                id="remediation" 
                placeholder="Notes on how to address gaps in understanding (AI suggestions will appear here in the future)" 
                value={remediation}
                onChange={(e) => setRemediation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground">
              Save Updates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {(lesson.status === "Done" && lesson.studentUnderstanding !== undefined) && (
        <div className="mt-2">
          <div className="flex justify-between items-center text-sm">
            <span>Student Understanding:</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className={`h-full rounded-full ${
                    lesson.studentUnderstanding >= 70 
                      ? "bg-lms-green" 
                      : lesson.studentUnderstanding >= 40 
                        ? "bg-lms-yellow" 
                        : "bg-lms-peach"
                  }`}
                  style={{ width: `${lesson.studentUnderstanding}%` }}
                ></div>
              </div>
              <span className="font-medium">{lesson.studentUnderstanding}%</span>
            </div>
          </div>
          
          {lesson.remediation && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Remediation:</span>
              <p className="text-gray-600 mt-1">{lesson.remediation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
