
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SubjectLibrary from "@/components/notebook/SubjectLibrary";
import NotebookInterface from "@/components/notebook/NotebookInterface";

const CLASS_LEVEL = "Class 10"; // This would ideally come from the student profile

const Notebook = () => {
  const { subjectId } = useParams();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-2 py-2 flex-grow">
        {!subjectId ? (
          <SubjectLibrary classLevel={CLASS_LEVEL} />
        ) : (
          <NotebookInterface subjectId={subjectId} classLevel={CLASS_LEVEL} />
        )}
      </div>
    </div>
  );
};

export default Notebook;
