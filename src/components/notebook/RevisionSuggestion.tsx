
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";

const RevisionSuggestion = () => {
  return (
    <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-md">
            <RotateCcw className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">Suggested Revision</div>
            <div className="text-sm text-gray-600">
              Class 8 - Light Chapter: Review concepts of refraction before continuing
            </div>
          </div>
        </div>
        
        <Button>
          Review Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default RevisionSuggestion;
