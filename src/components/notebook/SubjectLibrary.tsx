
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  Languages, 
  BookText 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SUBJECTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, Geometry, Trigonometry, Statistics",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-50"
  },
  {
    id: "science",
    name: "Science",
    description: "Physics, Chemistry, Biology",
    icon: Atom,
    color: "from-green-500 to-green-600",
    textColor: "text-green-50"
  },
  {
    id: "social-studies",
    name: "Social Studies",
    description: "History, Geography, Civics, Economics",
    icon: Globe,
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-50"
  },
  {
    id: "english",
    name: "English",
    description: "Literature, Grammar, Writing",
    icon: BookText,
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-50"
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "Literature, Grammar, Writing",
    icon: Languages,
    color: "from-red-500 to-red-600",
    textColor: "text-red-50"
  }
];

interface SubjectLibraryProps {
  classLevel: string;
}

const SubjectLibrary = ({ classLevel }: SubjectLibraryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h1 className="text-xl font-medium">{classLevel} Notebook</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => (
          <Link to={`/notebook/${subject.id}`} key={subject.id}>
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <div className={`bg-gradient-to-r ${subject.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${subject.textColor}`}>{subject.name}</h2>
                    <p className={`text-sm mt-1 opacity-90 ${subject.textColor}`}>
                      {subject.description}
                    </p>
                  </div>
                  <subject.icon className={`h-12 w-12 ${subject.textColor}`} />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>NCERT Textbook</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectLibrary;
