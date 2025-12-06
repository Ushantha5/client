"use client";

import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Search,
  Filter,
  TrendingUp,
  Award,
  Play
} from "lucide-react";

export default function CoursesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      category: "Development",
      level: "Beginner",
      students: 12453,
      rating: 4.8,
      duration: "52 hours",
      price: "$89.99",
      image: "bg-gradient-to-br from-blue-500 to-purple-600",
      description: "Master HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course."
    },
    {
      id: 2,
      title: "Machine Learning A-Z™",
      instructor: "Kirill Eremenko",
      category: "Data Science",
      level: "Intermediate",
      students: 8932,
      rating: 4.9,
      duration: "44 hours",
      price: "$94.99",
      image: "bg-gradient-to-br from-green-500 to-teal-600",
      description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts."
    },
    {
      id: 3,
      title: "The Complete Digital Marketing Course",
      instructor: "Rob Percival",
      category: "Marketing",
      level: "Beginner",
      students: 15678,
      rating: 4.7,
      duration: "23 hours",
      price: "$79.99",
      image: "bg-gradient-to-br from-orange-500 to-red-600",
      description: "12 Courses in 1: SEO, YouTube, Facebook, Google Ads, Instagram, Email & More!"
    },
    {
      id: 4,
      title: "iOS & Swift - The Complete iOS App Development",
      instructor: "Dr. Angela Yu",
      category: "Mobile Development",
      level: "Beginner",
      students: 9234,
      rating: 4.8,
      duration: "59 hours",
      price: "$99.99",
      image: "bg-gradient-to-br from-purple-500 to-pink-600",
      description: "Learn iOS app development from scratch. Build real apps including clones of Instagram and Uber."
    },
    {
      id: 5,
      title: "Complete Python Developer in 2024",
      instructor: "Andrei Neagoie",
      category: "Programming",
      level: "All Levels",
      students: 11567,
      rating: 4.9,
      duration: "31 hours",
      price: "$84.99",
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
      description: "Learn Python like a Professional! Start from the basics and go all the way to creating your own applications."
    },
    {
      id: 6,
      title: "The Complete 2024 Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      category: "Development",
      level: "Beginner",
      students: 18923,
      rating: 4.8,
      duration: "65 hours",
      price: "$89.99",
      image: "bg-gradient-to-br from-cyan-500 to-blue-600",
      description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-purple-600/20 to-blue-600/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover world-class courses taught by industry experts. Start learning today and advance your career.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for courses..."
                    className="pl-10 bg-background"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Total Courses", value: "150+", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Expert Instructors", value: "50+", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Active Students", value: "10k+", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Avg. Rating", value: "4.8", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`p-3 rounded-2xl mb-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.map((course, index) => (
            <motion.div key={course.id} variants={itemVariants}>
              <Card className="group border-border/50 overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                {/* Course Image */}
                <div className={`h-48 ${course.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black hover:bg-white">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/60 text-white border-0">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    By {course.instructor}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{course.rating}</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Load More Courses
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
