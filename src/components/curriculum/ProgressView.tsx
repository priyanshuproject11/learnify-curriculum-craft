
import { useState } from "react";
import { Curriculum } from "@/types/curriculum";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "lucide-react";

interface ProgressViewProps {
  curriculum: Curriculum | null;
}

const ProgressView = ({ curriculum }: ProgressViewProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("Class 9A");
  
  // Mock classes
  const classes = ["Class 9A", "Class 9B", "Class 10A", "Class 10B"];
  
  // Mock progress data
  const progressData = {
    "Class 9A": {
      unitsCompleted: 3,
      totalUnits: 7,
      completionPercentage: 43,
      topicPerformance: [
        { topic: "Algebra Basics", completion: 90, performance: 85 },
        { topic: "Linear Equations", completion: 75, performance: 70 },
        { topic: "Quadratic Equations", completion: 60, performance: 65 },
        { topic: "Geometry", completion: 30, performance: 80 },
        { topic: "Trigonometry", completion: 0, performance: 0 },
      ]
    },
    "Class 9B": {
      unitsCompleted: 2,
      totalUnits: 7,
      completionPercentage: 28,
      topicPerformance: [
        { topic: "Algebra Basics", completion: 100, performance: 80 },
        { topic: "Linear Equations", completion: 60, performance: 65 },
        { topic: "Quadratic Equations", completion: 20, performance: 60 },
        { topic: "Geometry", completion: 0, performance: 0 },
        { topic: "Trigonometry", completion: 0, performance: 0 },
      ]
    },
    "Class 10A": {
      unitsCompleted: 4,
      totalUnits: 8,
      completionPercentage: 50,
      topicPerformance: [
        { topic: "Advanced Algebra", completion: 100, performance: 75 },
        { topic: "Functions", completion: 90, performance: 80 },
        { topic: "Coordinate Geometry", completion: 85, performance: 90 },
        { topic: "Trigonometry", completion: 70, performance: 65 },
        { topic: "Statistics", completion: 0, performance: 0 },
      ]
    },
    "Class 10B": {
      unitsCompleted: 5,
      totalUnits: 8,
      completionPercentage: 62,
      topicPerformance: [
        { topic: "Advanced Algebra", completion: 100, performance: 80 },
        { topic: "Functions", completion: 100, performance: 85 },
        { topic: "Coordinate Geometry", completion: 90, performance: 75 },
        { topic: "Trigonometry", completion: 80, performance: 70 },
        { topic: "Statistics", completion: 20, performance: 85 },
      ]
    }
  };
  
  const getClassData = () => {
    return progressData[selectedClass as keyof typeof progressData];
  };
  
  const classData = getClassData();
  
  // Function to determine color based on performance score
  const getPerformanceColor = (score: number) => {
    if (score === 0) return "bg-gray-200";
    if (score < 60) return "bg-red-200";
    if (score < 75) return "bg-yellow-200";
    if (score < 90) return "bg-green-200";
    return "bg-emerald-200";
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-lms-blue/30 to-lms-blue/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">Curriculum Progress</h3>
                <p className="text-3xl font-bold mt-2">{classData.completionPercentage}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {classData.unitsCompleted} of {classData.totalUnits} units completed
                </p>
              </div>
              <div className="p-3 bg-white rounded-full">
                <BarChart className="h-6 w-6 text-lms-blue" />
              </div>
            </div>
            <Progress value={classData.completionPercentage} className="mt-4 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-lms-purple/30 to-lms-purple/10 md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Class Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="w-1/3">Topic</span>
                <span className="w-1/3 text-center">Completion</span>
                <span className="w-1/3 text-center">Performance</span>
              </div>
              
              {classData.topicPerformance.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="w-1/3 text-sm">{topic.topic}</span>
                  <div className="w-1/3 px-2">
                    <Progress value={topic.completion} className="h-2" />
                  </div>
                  <div className="w-1/3 flex justify-end">
                    {topic.performance > 0 ? (
                      <span 
                        className={`text-xs rounded-full px-3 py-1 ${getPerformanceColor(topic.performance)}`}
                      >
                        {topic.performance}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Not started</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-lg">Performance Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((week) => (
              <div key={week} className="space-y-2">
                <h4 className="text-xs font-medium text-center">Week {week}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {classData.topicPerformance.map((topic, idx) => {
                    // Mock data - simulate random performance for each week
                    const hasData = week <= 8; // Only show data for first 8 weeks
                    const randomPerf = hasData 
                      ? Math.max(0, topic.performance - Math.floor(Math.random() * 30))
                      : 0;
                    
                    return (
                      <div 
                        key={idx}
                        className={`h-6 rounded ${hasData ? getPerformanceColor(randomPerf) : 'bg-gray-100'}`}
                        title={`${topic.topic}: ${hasData ? randomPerf + '%' : 'No data'}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-red-200 mr-2" />
                <span className="text-xs">Below 60%</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-yellow-200 mr-2" />
                <span className="text-xs">60-75%</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-green-200 mr-2" />
                <span className="text-xs">75-90%</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-emerald-200 mr-2" />
                <span className="text-xs">90-100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressView;
