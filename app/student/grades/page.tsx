"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  TrendingUp, 
  Award, 
  Calendar,
  Download,
  Filter
} from "lucide-react";
import Link from "next/link";

interface Grade {
  id: string;
  course: string;
  assignment: string;
  score: string;
  grade: string;
  date: string;
  weight: number;
}

interface CourseGrade {
  id: string;
  course: string;
  instructor: string;
  currentGrade: string;
  letterGrade: string;
  credits: number;
  progress: number;
}

const recentGrades: Grade[] = [
  {
    id: "1",
    course: "Advanced React Development",
    assignment: "React Component Patterns",
    score: "18/20",
    grade: "A",
    date: "Dec 15, 2023",
    weight: 20
  },
  {
    id: "2",
    course: "UI/UX Design Principles",
    assignment: "Midterm Exam",
    score: "85/100",
    grade: "B+",
    date: "Dec 10, 2023",
    weight: 30
  },
  {
    id: "3",
    course: "Data Structures & Algorithms",
    assignment: "Algorithm Analysis",
    score: "18/20",
    grade: "A",
    date: "Dec 5, 2023",
    weight: 25
  },
  {
    id: "4",
    course: "Backend Development",
    assignment: "REST API Quiz",
    score: "15/20",
    grade: "B",
    date: "Nov 28, 2023",
    weight: 15
  }
];

const courseGrades: CourseGrade[] = [
  {
    id: "1",
    course: "Advanced React Development",
    instructor: "Alex Johnson",
    currentGrade: "92%",
    letterGrade: "A",
    credits: 3,
    progress: 65
  },
  {
    id: "2",
    course: "UI/UX Design Principles",
    instructor: "Sarah Chen",
    currentGrade: "87%",
    letterGrade: "B+",
    credits: 3,
    progress: 45
  },
  {
    id: "3",
    course: "Data Structures & Algorithms",
    instructor: "Michael Torres",
    currentGrade: "95%",
    letterGrade: "A",
    credits: 4,
    progress: 90
  },
  {
    id: "4",
    course: "Backend Development",
    instructor: "David Kim",
    currentGrade: "88%",
    letterGrade: "B+",
    credits: 3,
    progress: 75
  }
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-green-500";
  if (grade.startsWith("B")) return "text-blue-500";
  if (grade.startsWith("C")) return "text-yellow-500";
  if (grade.startsWith("D") || grade.startsWith("F")) return "text-red-500";
  return "text-muted-foreground";
};

export default function StudentGrades() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Grades</h1>
            <p className="text-muted-foreground mt-1">Track your academic performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* GPA Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current GPA</p>
                  <p className="text-2xl font-bold">3.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits Earned</p>
                  <p className="text-2xl font-bold">39</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-2xl font-bold">#12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Semester</p>
                  <p className="text-2xl font-bold">Fall 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Grades */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Course Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseGrades.map((course) => (
                    <div 
                      key={course.id} 
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{course.course}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor} • {course.credits} credits</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={course.progress} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">{course.progress}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getGradeColor(course.letterGrade)}`}>
                              {course.letterGrade}
                            </p>
                            <p className="text-sm text-muted-foreground">{course.currentGrade}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/grades/${course.id}`}>
                              View Details
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

          {/* Recent Assignments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5" />
                  Recent Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.map((grade) => (
                    <div key={grade.id} className="p-3 rounded-lg border border-border">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{grade.assignment}</h4>
                          <p className="text-xs text-muted-foreground">{grade.course}</p>
                        </div>
                        <Badge variant="secondary" className={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{grade.date}</span>
                        <span className="text-xs font-medium">{grade.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>A (90-100%)</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>B (80-89%)</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>C (70-79%)</span>
                      <span>18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>D/F (Below 70%)</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
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