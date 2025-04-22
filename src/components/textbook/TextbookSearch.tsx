
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DikshaTextbook } from "@/types/curriculum";
import { ExternalLink, Grid, LayoutList, Loader2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// NCERT PDFs based on class/subject
const NCERT_PDFS = {
  "Class 10": {
    "Mathematics": [
      {
        title: "NCERT Mathematics Class 10 (Full)",
        url: "https://ncert.nic.in/textbook/pdf/jemh1dd.zip",
        type: "zip",
        pdfViewerUrl: "https://ncert.nic.in/textbook/pdf/jemh1dd.pdf"
      },
      {
        title: "Chapter 1: Real Numbers",
        url: "https://ncert.nic.in/textbook/pdf/jemh101.pdf",
        pages: 18
      },
      {
        title: "Chapter 2: Polynomials",
        url: "https://ncert.nic.in/textbook/pdf/jemh102.pdf",
        pages: 14
      },
      {
        title: "Chapter 3: Pair of Linear Equations in Two Variables",
        url: "https://ncert.nic.in/textbook/pdf/jemh103.pdf",
        pages: 24
      },
      {
        title: "Chapter 4: Quadratic Equations",
        url: "https://ncert.nic.in/textbook/pdf/jemh104.pdf",
        pages: 20
      }
    ],
    "Science": [
      { 
        title: "NCERT Science Class 10 (Full)", 
        url: "https://ncert.nic.in/textbook/pdf/jesc1dd.zip",
        type: "zip",
        pdfViewerUrl: "https://ncert.nic.in/textbook/pdf/jesc1dd.pdf"
      }
    ]
  },
  "Class 9": {
    "Mathematics": [
      { 
        title: "NCERT Mathematics Class 9 (Full)", 
        url: "https://ncert.nic.in/textbook/pdf/iemh1dd.zip",
        type: "zip",
        pdfViewerUrl: "https://ncert.nic.in/textbook/pdf/iemh1dd.pdf"
      }
    ],
    "Science": [
      { 
        title: "NCERT Science Class 9 (Full)", 
        url: "https://ncert.nic.in/textbook/pdf/iesc1dd.zip",
        type: "zip",
        pdfViewerUrl: "https://ncert.nic.in/textbook/pdf/iesc1dd.pdf"
      }
    ]
  }
};

const TextbookSearch = ({ onSelectTextbook }: TextbookSearchProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("Class 10");
  const [selectedMedium, setSelectedMedium] = useState<string>("English");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [textbooks, setTextbooks] = useState<DikshaTextbook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchMode, setSearchMode] = useState<"api" | "direct">("direct");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const searchTextbooks = async () => {
    if (!selectedGrade || !selectedMedium || !selectedSubject) {
      toast.error("Please select all filters");
      return;
    }

    setIsLoading(true);
    try {
      if (searchMode === "api") {
        console.log(`Searching DIKSHA API for ${selectedGrade}, ${selectedMedium}, ${selectedSubject}`);
        
        // Try to use the DIKSHA API (likely to fail due to CORS/auth)
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
          console.log("API response:", data);
          setTextbooks(data.result.content || []);
          
          if (!data.result.content || data.result.content.length === 0) {
            toast.info("No textbooks found for the selected criteria");
          }
        } catch (error) {
          console.error("Error fetching from DIKSHA API:", error);
          throw error; // Forward to use mock data
        }
      } else {
        // Direct access to NCERT PDFs
        const mockBooks = getMockTextbooks(selectedGrade, selectedMedium, selectedSubject);
        console.log("Using direct NCERT PDF access");
        setTextbooks(mockBooks);
      }
    } catch (error) {
      console.error("Error in textbook search:", error);
      toast.error("Using local NCERT resources");
      setTextbooks(getMockTextbooks(selectedGrade, selectedMedium, selectedSubject));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTextbook = (textbook: DikshaTextbook) => {
    if (onSelectTextbook) {
      onSelectTextbook(textbook);
    }
    
    if (textbook.pdfUrl) {
      setSelectedPdf(textbook.pdfUrl);
    } else {
      window.open(`https://diksha.gov.in/play/content/${textbook.identifier}`, "_blank");
    }
  };

  // Automatically search on first load and parameter changes
  useEffect(() => {
    searchTextbooks();
  }, [selectedGrade, selectedSubject, searchMode]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="direct" onValueChange={(value) => setSearchMode(value as "api" | "direct")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="direct">NCERT Resources</TabsTrigger>
            <TabsTrigger value="api">DIKSHA API</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
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

        <div className="flex flex-wrap gap-4 items-center mb-6">
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
        </div>

        <TabsContent value="api">
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
              "Search DIKSHA API"
            )}
          </Button>

          {textbooks.length > 0 ? (
            <div className={`grid gap-4 mt-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
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
                  ? "No textbooks found for the selected criteria. Try the NCERT Resources tab for direct access."
                  : "Select filters above to search for textbooks"}
              </div>
            )
          )}
        </TabsContent>

        <TabsContent value="direct">
          <div className="grid gap-4 mt-2 grid-cols-1">
            {selectedGrade && selectedSubject && NCERT_PDFS[selectedGrade]?.[selectedSubject] ? (
              NCERT_PDFS[selectedGrade][selectedSubject].map((resource, index) => (
                <Card key={index} className={selectedPdf === resource.pdfViewerUrl ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-2 text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {resource.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Format: {resource.type || "PDF"}
                        </p>
                        {resource.pages && (
                          <p className="text-sm text-gray-600">
                            Pages: {resource.pages}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {resource.pdfViewerUrl && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (onSelectTextbook) {
                                const textbook: DikshaTextbook = {
                                  identifier: `pdf-${index}`,
                                  name: resource.title,
                                  medium: [selectedMedium],
                                  subject: [selectedSubject],
                                  gradeLevel: [selectedGrade],
                                  board: ["CBSE"],
                                  pdfUrl: resource.pdfViewerUrl // Added custom field
                                };
                                onSelectTextbook(textbook);
                                setSelectedPdf(resource.pdfViewerUrl);
                              }
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View PDF
                          </Button>
                        )}
                        <Button 
                          variant="secondary"
                          onClick={() => window.open(resource.url, "_blank")}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No NCERT resources available for the selected criteria. Please select a different class or subject.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPdf && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">PDF Viewer</h3>
            <Button variant="outline" size="sm" onClick={() => setSelectedPdf(null)}>
              Close Viewer
            </Button>
          </div>
          <div className="aspect-[3/4] w-full border rounded overflow-hidden">
            <iframe 
              src={selectedPdf} 
              className="w-full h-full" 
              title="NCERT Textbook"
              onError={() => {
                toast.error("Unable to load PDF directly. Please download it instead.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const getMockTextbooks = (grade: string, medium: string, subject: string): DikshaTextbook[] => {
  console.log(`Generating mock data for grade: ${grade}, medium: ${medium}, subject: ${subject}`);
  
  // Create mock textbooks based on NCERT resources
  const mockBooks: DikshaTextbook[] = [];
  
  // Add direct NCERT PDFs if available
  if (NCERT_PDFS[grade]?.[subject]) {
    NCERT_PDFS[grade][subject].forEach((resource, index) => {
      if (resource.pdfViewerUrl) {
        mockBooks.push({
          identifier: `ncert-${grade}-${subject}-${index}`,
          name: resource.title,
          description: `Official NCERT ${subject} textbook for ${grade} students. Direct PDF access.`,
          medium: [medium],
          subject: [subject],
          gradeLevel: [grade],
          board: ["CBSE"],
          pdfUrl: resource.pdfViewerUrl // Custom field for PDF URL
        });
      }
    });
  }
  
  // Add generic NCERT textbook if none found above
  if (mockBooks.length === 0) {
    mockBooks.push({
      identifier: `ncert-${grade}-${subject}-generic`,
      name: `NCERT ${subject} Textbook for ${grade}`,
      description: `Standard NCERT curriculum for ${subject} designed for ${grade} students.`,
      appIcon: "https://via.placeholder.com/150",
      medium: [medium],
      subject: [subject],
      gradeLevel: [grade],
      board: ["CBSE"]
    });
  }
  
  return mockBooks;
};

export default TextbookSearch;
