import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DikshaTextbook } from "@/types/curriculum";
import { ExternalLink, Grid, LayoutList, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TextbookSearchProps {
  onSelectTextbook?: (textbook: DikshaTextbook) => void;
}

const GRADES = [
  { value: "Class 1", label: "Class 1" },
  { value: "Class 2", label: "Class 2" },
  { value: "Class 3", label: "Class 3" },
  { value: "Class 4", label: "Class 4" },
  { value: "Class 5", label: "Class 5" },
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" }
];

const MEDIUMS = ["English", "Hindi"];
const SUBJECTS = ["Mathematics", "Science", "Social Studies", "English", "Hindi"];

const TextbookSearch = ({ onSelectTextbook }: TextbookSearchProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [textbooks, setTextbooks] = useState<DikshaTextbook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchTextbooks = async () => {
    if (!selectedGrade || !selectedMedium || !selectedSubject) {
      toast.error("Please select all filters");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Searching for ${selectedGrade}, ${selectedMedium}, ${selectedSubject}`);
      
      const response = await fetch("https://diksha.gov.in/api/composite/v3/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: {
            filters: {
              contentType: ["TextBook"],
              board: ["CBSE"],
              gradeLevel: [selectedGrade],
              medium: [selectedMedium],
              subject: [selectedSubject],
            },
            limit: 20,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch textbooks");
      }

      const data = await response.json();
      console.log("API response:", data);
      setTextbooks(data.result.content || []);
      
      if (!data.result.content || data.result.content.length === 0) {
        toast.info("No textbooks found for the selected criteria");
      }
    } catch (error) {
      console.error("Error fetching textbooks:", error);
      toast.error("Failed to fetch textbooks. Using mock data.");
      setTextbooks(getMockTextbooks(selectedGrade, selectedMedium, selectedSubject));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTextbook = (textbook: DikshaTextbook) => {
    if (onSelectTextbook) {
      onSelectTextbook(textbook);
    }
    window.open(`https://diksha.gov.in/play/content/${textbook.identifier}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {GRADES.map((grade) => (
              <SelectItem key={grade.value} value={grade.value}>
                {grade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMedium} onValueChange={setSelectedMedium}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Medium" />
          </SelectTrigger>
          <SelectContent>
            {MEDIUMS.map((medium) => (
              <SelectItem key={medium} value={medium}>
                {medium}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={searchTextbooks}
          disabled={isLoading || !selectedGrade || !selectedMedium || !selectedSubject}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search Textbooks"
          )}
        </Button>

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-accent" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-accent" : ""}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {textbooks.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {textbooks.map((textbook) => (
            <Card key={textbook.identifier}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-2">{textbook.name}</CardTitle>
                    <CardDescription>
                      {textbook.subject?.join(", ") || ""} | {textbook.medium?.join(", ") || ""}
                    </CardDescription>
                  </div>
                  {textbook.appIcon && (
                    <img 
                      src={textbook.appIcon} 
                      alt={textbook.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {textbook.description || "No description available"}
                </p>
                {textbook.gradeLevel && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">
                      Grade: {textbook.gradeLevel.join(", ")}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectTextbook(textbook)}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Textbook
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {selectedGrade || selectedMedium || selectedSubject 
              ? "No textbooks found for the selected criteria"
              : "Select filters above to search for textbooks"}
          </div>
        )
      )}
    </div>
  );
};

const getMockTextbooks = (grade: string, medium: string, subject: string): DikshaTextbook[] => {
  console.log(`Generating mock data for grade: ${grade}, medium: ${medium}, subject: ${subject}`);
  
  const mockCourses: DikshaTextbook[] = [
    {
      identifier: `diksha-CBSE-${grade}-${subject}-001`,
      name: `NCERT ${subject} Textbook for ${grade}`,
      description: `Complete ${subject} curriculum covering core concepts for ${grade} students following CBSE curriculum.`,
      appIcon: "https://via.placeholder.com/150",
      medium: [medium],
      subject: [subject],
      gradeLevel: [grade],
      board: ["CBSE"]
    },
    {
      identifier: `diksha-CBSE-${grade}-${subject}-002`,
      name: `Advanced ${subject} for ${grade}`,
      description: `Advanced topics in ${subject} for ${grade} students who have mastered the fundamentals.`,
      appIcon: "https://via.placeholder.com/150",
      medium: [medium],
      subject: [subject],
      gradeLevel: [grade],
      board: ["CBSE"]
    }
  ];
  
  return mockCourses;
};

export default TextbookSearch;
