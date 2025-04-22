
import { useState } from "react";
import { Curriculum } from "@/types/curriculum";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parse } from "date-fns";
import { Book, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

interface CalendarViewProps {
  curriculum: Curriculum | null;
}

const CalendarView = ({ curriculum }: CalendarViewProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("Class 9A");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const events = useRef([
    { id: 1, title: "Introducing Algebra", date: new Date(2025, 3, 5), unit: "Algebra Basics" },
    { id: 2, title: "Linear Equations", date: new Date(2025, 3, 12), unit: "Algebra Basics" },
    { id: 3, title: "Geometry Review", date: new Date(2025, 3, 18), unit: "Geometry" },
    { id: 4, title: "Mid-term Test", date: new Date(2025, 3, 25), unit: "Assessment" }
  ]);

  // Mock classes
  const classes = ["Class 9A", "Class 9B", "Class 10A", "Class 10B"];
  
  // Get days in the selected month with events
  const daysWithEvents = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const dayEvents = events.current.filter(event => 
        event.date.getDate() === day.getDate() && 
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
      );
      
      return {
        date: day,
        events: dayEvents,
        hasEvents: dayEvents.length > 0
      };
    });
  };

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.current.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get all events for the selected month
  const getMonthEvents = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    return events.current.filter(event => 
      isWithinInterval(new Date(event.date), {
        start: monthStart,
        end: monthEnd
      })
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const selectedDateEvents = getEventsForDate(date);
  const monthEvents = getMonthEvents();

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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Curriculum Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                onMonthChange={setSelectedMonth}
                className="rounded-md border w-full pointer-events-auto"
                modifiers={{
                  hasEvent: daysWithEvents()
                    .filter(day => day.hasEvents)
                    .map(day => day.date),
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    backgroundColor: "rgba(155, 135, 245, 0.2)"
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-lg">
                {format(date, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="bg-lms-blue/20 p-3 rounded-md">
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-2 text-lms-blue" />
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        Unit: {event.unit}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No lessons or assessments scheduled for this date
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="px-5 py-4 border-b">
              <CardTitle className="text-lg">
                {format(selectedMonth, "MMMM yyyy")} Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-1">
                {monthEvents.length > 0 ? (
                  <div>
                    {monthEvents.map((event, i) => (
                      <div 
                        key={event.id}
                        className={`flex px-5 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                        onClick={() => setDate(new Date(event.date))}
                      >
                        <div className="w-24 text-sm font-medium">
                          {format(new Date(event.date), "MMM dd")}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`ml-2 ${
                                event.unit === "Assessment" 
                                  ? "bg-lms-pink/20" 
                                  : "bg-lms-blue/20"
                              }`}
                            >
                              {event.unit}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedClass}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No events scheduled for this month</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
