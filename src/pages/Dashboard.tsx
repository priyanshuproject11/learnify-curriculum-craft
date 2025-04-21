
import { Link } from "react-router-dom";
import { Book, FileText, Brain, Trophy, Users, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Curriculum Planner",
    icon: <Book className="h-8 w-8" />,
    description: "Plan and organize your curriculum structure",
    href: "/curriculum",
    enabled: true,
  },
  {
    title: "Resources",
    icon: <FileText className="h-8 w-8" />,
    description: "Manage teaching materials and resources",
    href: "/resources",
    enabled: false,
  },
  {
    title: "AI Tools",
    icon: <Brain className="h-8 w-8" />,
    description: "AI-powered teaching assistants",
    href: "/ai-tools",
    enabled: false,
  },
  {
    title: "Assessments",
    icon: <Trophy className="h-8 w-8" />,
    description: "Create and manage assessments",
    href: "/assessments",
    enabled: false,
  },
  {
    title: "Students",
    icon: <Users className="h-8 w-8" />,
    description: "Student profiles and progress tracking",
    href: "/students",
    enabled: false,
  },
  {
    title: "Settings",
    icon: <Settings className="h-8 w-8" />,
    description: "Configure your LMS settings",
    href: "/settings",
    enabled: false,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-blue/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to Learnify</h1>
          <p className="text-gray-600 mt-2">Your AI-powered Learning Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.enabled ? feature.href : "#"}
              className={`${!feature.enabled && "pointer-events-none"}`}
            >
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 rounded-full ${
                      feature.enabled ? "bg-primary" : "bg-gray-100"
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-xl">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                    {!feature.enabled && (
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
