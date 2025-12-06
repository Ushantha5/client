"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Search,
  Filter,
  TrendingUp,
  Award,
  Play,
  X
} from "lucide-react";

const COURSES_DATA = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    category: "Development",
    level: "Beginner",
    students: 12453,
    rating: 4.8,
    duration: "52 hours",
    price: 89.99,
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
    price: 94.99,
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
    price: 79.99,
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
    price: 99.99,
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
    price: 84.99,
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
    price: 89.99,
    image: "bg-gradient-to-br from-cyan-500 to-blue-600",
    description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps."
  },
  {
    id: 7,
    title: "Advanced React Patterns",
    instructor: "Kent C. Dodds",
    category: "Development",
    level: "Advanced",
    students: 7234,
    rating: 4.9,
    duration: "38 hours",
    price: 99.99,
    image: "bg-gradient-to-br from-indigo-500 to-blue-600",
    description: "Master advanced React patterns and techniques used by top companies worldwide."
  },
  {
    id: 8,
    title: "Data Science Masterclass",
    instructor: "Jose Portilla",
    category: "Data Science",
    level: "Intermediate",
    students: 13456,
    rating: 4.8,
    duration: "48 hours",
    price: 89.99,
    image: "bg-gradient-to-br from-teal-500 to-green-600",
    description: "Complete data science bootcamp covering Python, Pandas, NumPy, Matplotlib, and Machine Learning."
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique categories and levels
  const categories = useMemo(() => {
    const cats = Array.from(new Set(COURSES_DATA.map(c => c.category)));
    return ["all", ...cats];
  }, []);

  const levels = useMemo(() => {
    const lvls = Array.from(new Set(COURSES_DATA.map(c => c.level)));
    return ["all", ...lvls];
  }, []);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = COURSES_DATA;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b.students - a.students);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("popular");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedLevel !== "all" || sortBy !== "popular";

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
              <div className="flex flex-col gap-4">
                {/* Search and Filter Button Row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses, instructors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background"
                    />
                  </div>
                  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2 relative">
                        <Filter className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Filters</h4>
                          {hasActiveFilters && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="h-8 text-xs"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                  {cat === "all" ? "All Categories" : cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Level</label>
                          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent>
                              {levels.map(lvl => (
                                <SelectItem key={lvl} value={lvl}>
                                  {lvl === "all" ? "All Levels" : lvl}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Sort By</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="popular">Most Popular</SelectItem>
                              <SelectItem value="rating">Highest Rated</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchQuery}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedCategory}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedCategory("all")}
                        />
                      </Badge>
                    )}
                    {selectedLevel !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedLevel}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedLevel("all")}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>

        {/* Courses Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              key="courses-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants} layout>
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
                        <span className="text-2xl font-bold text-primary">${course.price}</span>
                        <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
