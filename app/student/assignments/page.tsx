"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  points?: string;
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "React Component Patterns",
    course: "Advanced React Development",
    dueDate: "Dec 22, 2023",
    dueTime: "11:59 PM",
    status: "pending",
    points: "20 pts"
  },
  {
    id: "2",
    title: "UI Design Prototype",
    course: "UI/UX Design Principles",
    dueDate: "Dec 25, 2023",
    dueTime: "10:00 AM",
    status: "submitted",
    points: "30 pts"
  },
  {
    id: "3",
    title: "Algorithm Analysis",
    course: "Data Structures & Algorithms",
    dueDate: "Dec 28, 2023",
    dueTime: "11:59 PM",
    status: "graded",
    grade: "18/20",
    points: "20 pts"
  },
  {
    id: "4",
    title: "Database Schema Design",
    course: "Backend Development",
    dueDate: "Jan 5, 2024",
    dueTime: "11:59 PM",
    status: "pending",
    points: "25 pts"
  }
];

const getStatusIcon = (status: Assignment["status"]) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "submitted":
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "graded":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusText = (status: Assignment["status"]) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "submitted":
      return "Submitted";
    case "graded":
      return "Graded";
    default:
      return "Unknown";
  }
};

const getStatusVariant = (status: Assignment["status"]) => {
  switch (status) {
    case "pending":
      return "warning";
    case "submitted":
      return "info";
    case "graded":
      return "success";
    default:
      return "secondary";
  }
};

export default function StudentAssignments() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground mt-1">View and submit your course assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Assignment List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(assignment.status)}
                            <div>
                              <h3 className="font-medium">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assignment.course}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>Due {assignment.dueDate} at {assignment.dueTime}</span>
                                </div>
                                <span className="text-xs">•</span>
                                <span className="text-xs text-muted-foreground">{assignment.points}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(assignment.status) as any}>
                            {getStatusText(assignment.status)}
                            {assignment.grade && ` • ${assignment.grade}`}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/assignments/${assignment.id}`}>
                              <Eye className="w-4 h-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Graded</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Points</span>
                    <span className="font-bold">75 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="font-medium text-sm">React Component Patterns</p>
                    <p className="text-xs text-muted-foreground mt-1">Due Dec 22, 11:59 PM</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="font-medium text-sm">Database Schema Design</p>
                    <p className="text-xs text-muted-foreground mt-1">Due Jan 5, 11:59 PM</p>
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