"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from "react";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { PermissionsManager } from "@/components/permissions-manager";
import { Footer } from "@/components/layout/footer";
import { LiquidProgressBar } from "@/components/dashboard/progress-bar";
import { Trophy, Star, Zap, Clock, BookOpen, Activity, Upload } from "lucide-react";
import { enrollmentService } from "@/services/enrollment.service";
import { Enrollment } from "@/services/enrollment.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import Image from "next/image";

interface UserStats {
  streak: number;
  hoursLearned: number;
  modulesCompleted: number;
  totalModules: number;
}

interface SubjectProgress {
  name: string;
  progress: number;
}

// Extend the editing user interface to include avatarUrl
interface EditingUser {
  name: string;
  email: string;
  language: string;
  timezone: string;
  avatarUrl?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useEnhancedUser();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    hoursLearned: 0,
    modulesCompleted: 0,
    totalModules: 0
  });
  const [subjects, setSubjects] = useState<SubjectProgress[]>([]);

  // Variables to track user level and progress
  const [level, setLevel] = useState(0);
  const [loginCount, setLoginCount] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  // Removed unused variable lastRewardedLevel

  // Profile edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUser>({
    name: "",
    email: "",
    language: "",
    timezone: "",
    avatarUrl: undefined
  });

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to load user data
  useEffect(() => {
    if (!user) return;

    // Load login count from localStorage
    const savedLoginCount = localStorage.getItem(`login_count_${user.id}`);
    if (savedLoginCount) {
      const parsedLoginCount = parseInt(savedLoginCount, 10);
      setLoginCount(parsedLoginCount);

      // Calculate level (1 level per 5 logins)
      const calculatedLevel = Math.min(100, Math.floor(parsedLoginCount / 5));
      setLevel(calculatedLevel);

      // Show surprise reward every 10 levels
      const savedLastRewardedLevel = localStorage.getItem(`last_rewarded_level_${user.id}`);
      if (calculatedLevel > 0 && calculatedLevel % 10 === 0 &&
        (!savedLastRewardedLevel || calculatedLevel > parseInt(savedLastRewardedLevel, 10))) {
        setShowSurprise(true);
        // Save last rewarded level
        localStorage.setItem(`last_rewarded_level_${user.id}`, calculatedLevel.toString());
      }
    } else {
      // If no saved login count, initialize with a default value
      // This simulates the login count for demonstration purposes
      const simulatedLoginCount = 12; // This would normally come from the backend or be incremented on login
      setLoginCount(simulatedLoginCount);
      localStorage.setItem(`login_count_${user.id}`, simulatedLoginCount.toString());

      // Calculate level based on simulated login count
      const calculatedLevel = Math.min(100, Math.floor(simulatedLoginCount / 5));
      setLevel(calculatedLevel);
      localStorage.setItem(`user_level_${user.id}`, calculatedLevel.toString());
    }

    // Initialize editing user data
    setEditingUser({
      name: user.name || "",
      email: user.email || "",
      language: user.language || "",
      timezone: user.timezone || "",
      avatarUrl: user.avatarUrl || undefined
    });
  }, [user]);

  // Function to close surprise reward notification
  const closeSurprise = () => {
    setShowSurprise(false);
  };

  // Function to open edit modal
  const openEditModal = () => {
    if (user) {
      setEditingUser({
        name: user.name || "",
        email: user.email || "",
        language: user.language || "",
        timezone: user.timezone || "",
        avatarUrl: user.avatarUrl || undefined
      });
      // Set initial avatar preview
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
    }
    setShowEditModal(true);
  };

  // Function to handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Set file and preview
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Function to trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // If avatar file is selected, upload to Cloudinary first
      let avatarUrl = editingUser.avatarUrl;
      if (avatarFile) {
        const uploadResult = await uploadToCloudinary(avatarFile, {
          folder: "avatars",
          tags: ["profile", "avatar"]
        });

        if (!uploadResult) {
          throw new Error("Failed to upload avatar");
        }

        avatarUrl = uploadResult.secure_url;
      }

      // Update profile with all data including avatar URL
      const updateData = {
        ...editingUser,
        avatarUrl
      };

      await authService.updateProfile(updateData);
      await refreshUser();
      setShowEditModal(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);

        // Fetch user enrollments
        const enrollmentResponse = await enrollmentService.getMyEnrollments();
        setEnrollments(enrollmentResponse.data);

        // Calculate stats based on real data
        const completedCourses = enrollmentResponse.data.filter(enrollment => enrollment.status === "completed").length;
        const totalCourses = enrollmentResponse.data.length;
        // Removed unused variable avgProgress

        setStats({
          streak: Math.floor(Math.random() * 30) + 1, // Simulate real streak data
          hoursLearned: parseFloat((Math.random() * 100).toFixed(1)), // Simulate real hours data
          modulesCompleted: completedCourses,
          totalModules: totalCourses
        });

        // Set subject progress based on real courses
        const courseSubjects: SubjectProgress[] = enrollmentResponse.data.slice(0, 4).map((enrollment) => ({
          name: enrollment.course.title.length > 15
            ? enrollment.course.title.substring(0, 15) + "..."
            : enrollment.course.title,
          progress: enrollment.progress
        }));

        // Fill remaining slots with sample subjects if needed
        while (courseSubjects.length < 4) {
          const sampleSubjects = ["Physics", "Math", "Coding", "History"];
          courseSubjects.push({
            name: sampleSubjects[courseSubjects.length] || "General",
            progress: Math.floor(Math.random() * 100)
          });
        }

        setSubjects(courseSubjects);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen w-full bg-[#0b1226] flex items-center justify-center">
        <div className="text-white flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate progress percentage (5 logins per level)
  const progressPercentage = ((loginCount % 5) / 5) * 100;

  return (
    <div className="min-h-screen w-full bg-[#0b1226] overflow-x-hidden relative font-sans selection:bg-purple-500/30">
      {/* Cosmic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0b1226] via-[#1a1f3c] to-[#0f172a] z-0" />
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse z-0" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700 z-0" />

      {/* Surprise reward notification every 10 levels */}
      {showSurprise && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-xl animate-bounce">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              <span className="font-bold">Congratulations! Level {level} Achievement!</span>
            </div>
            <button
              onClick={closeSurprise}
              className="text-white hover:text-gray-200 font-bold"
            >
              &times;
            </button>
          </div>
          <p className="text-sm mt-1">You&apos;ve unlocked a special reward for reaching level {level}!</p>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1226] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/60 hover:text-white"
              >
                Back
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="object-cover w-full h-full"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="text-white/20">
                        <Activity className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-1.5 border-2 border-[#0b1226] hover:bg-cyan-400 transition-colors"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  disabled={isUploading}
                />
                <p className="text-xs text-white/60 mt-2">Click icon to upload avatar</p>
                <p className="text-xs text-white/40 mt-1">JPG, PNG (max 5MB)</p>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Language</label>
                <input
                  type="text"
                  value={editingUser.language}
                  onChange={(e) => setEditingUser({ ...editingUser, language: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Timezone</label>
                <input
                  type="text"
                  value={editingUser.timezone}
                  onChange={(e) => setEditingUser({ ...editingUser, timezone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  disabled={isUploading}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header / Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-[float_6s_ease-in-out_infinite]">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            {/* Holographic Ring */}
            <div className="absolute -inset-4 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute -inset-4 border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="object-cover w-full h-full"
                  width={224}
                  height={224}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-4xl md:text-6xl text-white/20 font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            {/* OLD STATIC LEVEL DISPLAY REPLACED HERE */}
            {/* New dynamic level display */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform translate-x-2 translate-y-2">
              Level {level} / 100
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200">
              {user.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium backdrop-blur-sm">
                {user.role === "student" ? "Cadet Rank" : user.role}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium backdrop-blur-sm">
                {user.role === "student" ? "Science Track" : "Educator"}
              </span>
            </div>
            <p className="text-blue-200/60 mt-2">{user.email}</p>
            <div className="mt-4">
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white transition-all backdrop-blur-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Stats & Badges */}
          <div className="space-y-8 lg:col-span-1">
            {/* Summary Panel */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors duration-300">
              <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Current Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200/60">Learning Streak</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {stats.streak} Days
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200/60">Hours Learned</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    {stats.hoursLearned} hrs
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200/60">Modules Completed</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    {stats.modulesCompleted}/{stats.totalModules}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200/60">User Level</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {level}/100
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200/60">Logins</span>
                  <span className="text-white font-bold">
                    {loginCount}
                  </span>
                </div>
                {/* Show progress bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-blue-200/60 mb-1">
                    <span>Next Level Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-blue-200/60 mt-1">
                    {5 - (loginCount % 5)} more logins for next level
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Panel */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Star className={`h-8 w-8 ${i <= 3 ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} drop-shadow-lg transform group-hover:scale-110 transition-transform`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Progress & Courses */}
          <div className="space-y-8 lg:col-span-2">
            {/* Permissions Manager */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h3 className="text-white/80 font-bold mb-4">Permissions & Settings</h3>
              <PermissionsManager />
            </div>

            {/* Liquid Progress Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-[#0b1226]/80 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors" />

              <div className="relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Weekly Goal</h2>
                    <p className="text-blue-200/60 text-sm">Keep up the great momentum!</p>
                  </div>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {Math.min(100, Math.max(0, stats.modulesCompleted * 10))}%
                  </span>
                </div>

                <LiquidProgressBar progress={Math.min(100, Math.max(0, stats.modulesCompleted * 10))} className="h-8" />

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {subjects.map((subject, index) => (
                    <div key={index} className="bg-black/20 rounded-xl p-3 border border-white/5 text-center">
                      <div className="text-xs text-blue-300/60 mb-1 truncate">{subject.name}</div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-white/80 mt-1">{subject.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity / Course Strip */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white/80 font-bold px-2">Continue Learning</h3>
                <button
                  onClick={() => router.push("/courses")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.slice(0, 2).map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="group relative h-48 rounded-[30px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                    onClick={() => router.push(`/course/${enrollment.course._id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    {/* Course thumbnail or color based on course */}
                    <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-800/40 transition-colors" />

                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${enrollment.status === "completed"
                            ? "bg-green-500 text-white"
                            : enrollment.progress > 0
                              ? "bg-cyan-500 text-black"
                              : "bg-purple-500 text-white"
                          } uppercase tracking-wider`}>
                          {enrollment.status === "completed" ? "Completed" : enrollment.progress > 0 ? "In Progress" : "New"}
                        </span>
                        <span className="text-white/80 text-xs">{enrollment.progress}%</span>
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {enrollment.course.title}
                      </h4>
                      <p className="text-white/60 text-sm mt-1 truncate">
                        {enrollment.course.teacher.name}
                      </p>
                    </div>
                  </div>
                ))}

                {enrollments.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white/80 mb-2">No Enrollments Yet</h3>
                    <p className="text-white/60 mb-4">Start your learning journey by enrolling in a course</p>
                    <button
                      onClick={() => router.push("/courses")}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}