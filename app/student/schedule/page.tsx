"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter
} from "lucide-react";


interface Event {
  id: string;
  title: string;
  course: string;
  type: "class" | "exam" | "assignment" | "meeting";
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  instructor?: string;
  description?: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    course: "Advanced React Development",
    type: "class",
    date: "2023-12-18",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: "Room 204",
    instructor: "Alex Johnson"
  },
  {
    id: "2",
    title: "UI Design Critique",
    course: "UI/UX Design Principles",
    type: "class",
    date: "2023-12-18",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    location: "Design Lab",
    instructor: "Sarah Chen"
  },
  {
    id: "3",
    title: "Data Structures Midterm",
    course: "Data Structures & Algorithms",
    type: "exam",
    date: "2023-12-20",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    location: "Main Hall",
    instructor: "Michael Torres"
  },
  {
    id: "4",
    title: "Backend API Assignment Due",
    course: "Backend Development",
    type: "assignment",
    date: "2023-12-22",
    startTime: "11:59 PM",
    endTime: "11:59 PM"
  },
  {
    id: "5",
    title: "1:1 Meeting with Advisor",
    course: "Academic Advising",
    type: "meeting",
    date: "2023-12-21",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    location: "Advisor Office"
  }
];

const getEventTypeColor = (type: Event["type"]) => {
  switch (type) {
    case "class":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "exam":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "assignment":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "meeting":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getEventTypeIcon = (type: Event["type"]) => {
  switch (type) {
    case "class":
      return <Users className="w-4 h-4" />;
    case "exam":
      return <Clock className="w-4 h-4" />;
    case "assignment":
      return <Calendar className="w-4 h-4" />;
    case "meeting":
      return <Video className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

const isToday = (dateString: string) => {
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

export default function StudentSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const navigateDays = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground mt-1">Your upcoming classes, exams, and deadlines</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDays(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <p className="text-muted-foreground">
              {formatDate(currentDate.toISOString().split('T')[0])}
              {isToday(currentDate.toISOString().split('T')[0]) && " (Today)"}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDays(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Schedule View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(groupedEvents).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                      <div key={date}>
                        <h3 className="font-medium text-lg mb-3 pb-2 border-b border-border">
                          {formatDate(date)}
                          {isToday(date) && " (Today)"}
                        </h3>
                        <div className="space-y-3">
                          {dateEvents.map((event) => (
                            <div
                              key={event.id}
                              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg border ${getEventTypeColor(event.type)}`}>
                                  {getEventTypeIcon(event.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                      <h4 className="font-medium">{event.title}</h4>
                                      <p className="text-sm text-muted-foreground">{event.course}</p>
                                    </div>
                                    <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Clock className="w-4 h-4" />
                                      <span>{event.startTime} - {event.endTime}</span>
                                    </div>

                                    {event.location && (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}

                                    {event.instructor && (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{event.instructor}</span>
                                      </div>
                                    )}
                                  </div>

                                  {event.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {event.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-1">No events scheduled</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don&apos;t have any events for this period
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classes Today</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upcoming Exams</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assignments Due</span>
                  <span className="font-medium">1</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="font-medium text-sm">Submit React Assignment</p>
                    <p className="text-xs text-muted-foreground mt-1">Due Dec 22, 11:59 PM</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="font-medium text-sm">Data Structures Exam</p>
                    <p className="text-xs text-muted-foreground mt-1">Dec 20, 9:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}