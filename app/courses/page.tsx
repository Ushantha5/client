"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { courseService, Course } from "@/services/course.service";
import { paymentService } from "@/services/payment.service";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { useAPICache } from "@/hooks/useAdvancedCache";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateStructuredData } from "@/lib/seo";
import Image from "next/image";
import { toast } from "sonner";

const gradientColors = [
  "bg-gradient-to-br from-blue-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-purple-500 to-pink-600",
  "bg-gradient-to-br from-yellow-500 to-orange-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-indigo-500 to-blue-600",
  "bg-gradient-to-br from-teal-500 to-green-600",
];

export default function CoursesPage() {
  const { user } = useEnhancedUser();
  const { data: coursesData, loading: coursesLoading } = useAPICache(
    "allCourses",
    () => courseService.getAllCourses(),
    { ttl: 5 * 60 * 1000 } // 5 minutes cache
  );

  // Update courses state when data changes
  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData.data || []);
    }
  }, [coursesData]);

  // Update loading state
  useEffect(() => {
    setLoading(coursesLoading);
  }, [coursesLoading]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  // Fetch courses from API
  // Removed old useEffect since we're using useAPICache now

  // Extract unique categories and levels
  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
    return ["all", ...cats];
  }, [courses]);

  const levels = useMemo(() => {
    const lvls = Array.from(new Set(courses.map(c => c.level).filter(Boolean)));
    return ["all", ...lvls];
  }, [courses]);

  // Handle enrollment
  const handleEnroll = async (courseId: string) => {
    console.log("Attempting to enroll in course:", courseId);
    console.log("Current user state:", user);

    if (!user) {
      console.warn("Enroll failed: User not logged in");
      toast.error("Please login to enroll in courses");
      router.push("/auth/login?redirect=/courses"); // Fixed redirect path
      return;
    }

    if (user.role !== "student") {
      console.warn("Enroll failed: User role is", user.role);
      toast.error(`Only students can enroll in courses (Current role: ${user.role})`);
      return;
    }

    try {
      setEnrollingCourseId(courseId);
      console.log("Calling paymentService.createCheckoutSession...");
      const response = await paymentService.createCheckoutSession(courseId);
      console.log("Checkout session response:", response);

      if (response.url) {
        window.location.href = response.url;
      } else {
        console.error("No URL returned in checkout session response");
        toast.error("Failed to redirect to payment gateway");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.error || "Failed to start enrollment process");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.teacher?.name.toLowerCase().includes(query)
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
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      default:
        // Default: sort by creation date (newest first)
        filtered = [...filtered].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

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
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const breadcrumbData = generateStructuredData("BreadcrumbList", {
    items: [
      { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com" },
      { name: "Courses", url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com"}/courses` },
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {breadcrumbData && <StructuredData data={breadcrumbData} />}
      <Navbar />

      {/* Hero Section - Deep Space aesthetic */}
      <div className="relative h-72 w-full overflow-hidden">
        {/* Background Huly Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Explore The Library
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Master new skills with our AI-enhanced curriculum. <br className="hidden md:block" />
              Designed for the next generation of creators.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 sticky top-20 z-40"
        >
          <div className="bg-surface/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary h-11 rounded-xl"
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 h-11 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((cat): cat is string => Boolean(cat)).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10 h-11 rounded-xl">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(lvl => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl === "all" ? "All Levels" : lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 h-11 rounded-xl">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-11 px-4 text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
            Library Index <span className="text-primary mx-2">{'//'}</span> {filteredCourses.length} Items Found
          </p>
        </div>

        {/* Courses Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Syncing Library Data...</p>
              </div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <motion.div
              key="courses-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div key={course._id} variants={itemVariants} layout className="h-full">
                  <div className="group relative h-full border border-white/5 bg-surface overflow-hidden rounded-2xl hover:border-primary/50 transition-colors duration-500">
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full ${gradientColors[index % gradientColors.length]} opacity-50`} />
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent opacity-80" />

                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 text-white">
                          {course.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col h-[calc(100%-aspect-[4/3])] relative mt-[-20%] z-10">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                          <span className="text-lg font-bold text-foreground">${course.price}</span>
                        </div>
                        <Button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingCourseId === course._id}
                          size="sm"
                          className="bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300"
                        >
                          {enrollingCourseId === course._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-2" />
                          )}
                          Enroll
                        </Button>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No matching courses</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn&apos;t find any courses matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}