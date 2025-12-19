import apiClient from "@/lib/apiClient";

export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  recentEnrollments: number;
  isTopRated: boolean;
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    const response = await apiClient.get("/api/admin/stats");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
    // Return default values in case of error
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      recentEnrollments: 0,
      isTopRated: true
    };
  }
}