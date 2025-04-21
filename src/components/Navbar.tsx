
import { useState } from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [activeView, setActiveView] = useState("curriculum");

  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-md border-b sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary-foreground" />
          <h1 className="font-bold text-xl">Learnify</h1>
        </div>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Button
                variant={activeView === "curriculum" ? "default" : "ghost"}
                onClick={() => setActiveView("curriculum")}
                className="rounded-full"
              >
                Curriculum
              </Button>
            </li>
            <li>
              <Button
                variant={activeView === "resources" ? "default" : "ghost"}
                onClick={() => setActiveView("resources")}
                className="rounded-full"
                disabled
              >
                Resources
              </Button>
            </li>
            <li>
              <Button
                variant={activeView === "assessments" ? "default" : "ghost"}
                onClick={() => setActiveView("assessments")}
                className="rounded-full"
                disabled
              >
                Assessments
              </Button>
            </li>
            <li>
              <Button
                variant={activeView === "ai-tools" ? "default" : "ghost"}
                onClick={() => setActiveView("ai-tools")}
                className="rounded-full"
                disabled
              >
                AI Tools
              </Button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="rounded-full">
            Help
          </Button>
          <Button className="rounded-full">My Account</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
