"use client";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Courses</h1>
        <p className="text-muted-foreground mb-6">Explore our catalog of courses across topics.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i)=> (
            <div key={i} className="border rounded-lg p-4 bg-card">
              <h3 className="font-semibold">Course {i}</h3>
              <p className="text-sm text-muted-foreground">Short description of course {i}.</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href={`/courses/${i}`}>View Course</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
