
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BoardType, Grade, TimeFrame, Curriculum } from "@/types/curriculum";
import { v4 as uuidv4 } from "uuid";

interface CurriculumFormProps {
  onCurriculumCreate: (curriculum: Curriculum) => void;
}

const CurriculumForm = ({ onCurriculumCreate }: CurriculumFormProps) => {
  const [boardType, setBoardType] = useState<BoardType | "">("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [subject, setSubject] = useState("");
  const [timeframe, setTimeframe] = useState<TimeFrame | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!boardType || !grade || !subject || !timeframe) return;
    
    const newCurriculum: Curriculum = {
      id: uuidv4(),
      boardType: boardType as BoardType,
      grade: grade as Grade,
      subject,
      timeframe: timeframe as TimeFrame,
      units: []
    };
    
    onCurriculumCreate(newCurriculum);
  };
  
  return (
    <div className="lms-card mb-6 bg-gradient-to-br from-lms-blue/40 to-lms-purple/40">
      <h2 className="text-xl font-bold mb-4">Create Curriculum Plan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="lms-input-group">
            <Label htmlFor="board-type">Board Type</Label>
            <Select 
              value={boardType} 
              onValueChange={(value) => setBoardType(value as BoardType)}
            >
              <SelectTrigger id="board-type" className="bg-white/70">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
                <SelectItem value="IB">IB</SelectItem>
                <SelectItem value="State Board">State Board</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="lms-input-group">
            <Label htmlFor="grade">Class/Grade</Label>
            <Select 
              value={grade} 
              onValueChange={(value) => setGrade(value as Grade)}
            >
              <SelectTrigger id="grade" className="bg-white/70">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((gradeNum) => (
                  <SelectItem key={gradeNum} value={gradeNum.toString()}>
                    Grade {gradeNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="lms-input-group">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Mathematics, Science, English"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/70"
            />
          </div>
          
          <div className="lms-input-group">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select 
              value={timeframe} 
              onValueChange={(value) => setTimeframe(value as TimeFrame)}
            >
              <SelectTrigger id="timeframe" className="bg-white/70">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term">Term</SelectItem>
                <SelectItem value="Quarter">Quarter</SelectItem>
                <SelectItem value="Month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={!boardType || !grade || !subject || !timeframe}
          className="mt-4 bg-lms-purple hover:bg-lms-purple/80 text-black"
        >
          Create Curriculum
        </Button>
      </form>
    </div>
  );
};

export default CurriculumForm;
