
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DikshaTextbook } from "@/types/curriculum";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NCERT_WORKING_PDFS } from "@/services/pdfProxy";

interface TextbookSearchProps {
  onSelectTextbook?: (textbook: DikshaTextbook) => void;
}

const GRADES = [
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" }
];

const SUBJECTS = ["Mathematics", "Science"];

const TextbookSearch = ({ onSelectTextbook }: TextbookSearchProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("Class 10");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");

  const handleSelectTextbook = (resource: any) => {
    if (onSelectTextbook) {
      const textbook: DikshaTextbook = {
        identifier: `pdf-${resource.title}`,
        name: resource.title,
        medium: ["English"],
        subject: [selectedSubject],
        gradeLevel: [selectedGrade],
        board: ["CBSE"],
        pdfUrl: resource.url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Fallback to dummy PDF
      };
      onSelectTextbook(textbook);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
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

      <div className="grid gap-4">
        {selectedGrade && selectedSubject && NCERT_WORKING_PDFS[selectedGrade]?.[selectedSubject] ? (
          NCERT_WORKING_PDFS[selectedGrade][selectedSubject].map((resource, index) => (
            <Card key={index} className="hover:bg-gray-50 transition-colors">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{resource.title}</div>
                    {resource.pages && (
                      <div className="text-sm text-gray-500">
                        {resource.pages} pages
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={() => handleSelectTextbook(resource)}>
                  View Chapter
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No chapters available for the selected criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default TextbookSearch;
