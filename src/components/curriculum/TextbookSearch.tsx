
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DikshaTextbook } from "@/types/curriculum";
import { ExternalLink, Grid, LayoutList, Loader2 } from "lucide-react";
import { toast } from "sonner";

const GRADES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const MEDIUMS = ["English", "Hindi"];
const SUBJECTS = ["Mathematics", "Science", "Social Studies", "English", "Hindi"];

const TextbookSearch = () => {
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
      setTextbooks(data.result.content);
      
      if (data.result.content.length === 0) {
        toast.info("No textbooks found for the selected criteria");
      }
    } catch (error) {
      console.error("Error fetching textbooks:", error);
      toast.error("Failed to fetch textbooks. Using mock data.");
      // Fallback to mock data
      setTextbooks(getMockTextbooks());
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTextbook = (identifier: string) => {
    window.open(`https://diksha.gov.in/play/content/${identifier}`, "_blank");
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
              <SelectItem key={grade} value={grade}>
                {grade}
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
                      {textbook.subject.join(", ")} | {textbook.medium.join(", ")}
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
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleOpenTextbook(textbook.identifier)}
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

// Mock data for testing and fallback
const getMockTextbooks = (): DikshaTextbook[] => [
  {
    identifier: "do_1234567890",
    name: "NCERT Science Textbook for Class 6",
    description: "Complete science curriculum covering physics, chemistry and biology concepts for Class 6 students following CBSE curriculum.",
    appIcon: "https://via.placeholder.com/150",
    medium: ["English"],
    subject: ["Science"],
    gradeLevel: ["Class 6"],
    board: ["CBSE"]
  },
  {
    identifier: "do_0987654321",
    name: "NCERT Mathematics Textbook for Class 6",
    description: "Comprehensive mathematics textbook covering arithmetic, algebra, geometry and more for Class 6 CBSE students.",
    appIcon: "https://via.placeholder.com/150",
    medium: ["English"],
    subject: ["Mathematics"],
    gradeLevel: ["Class 6"],
    board: ["CBSE"]
  }
];

export default TextbookSearch;
