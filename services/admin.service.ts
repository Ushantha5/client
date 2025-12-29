import apiClient from "@/lib/apiClient";
import { handleApiError } from "@/lib/errorHandler";

// Define types for better type safety
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  level?: string;
  language?: string;
  thumbnail?: string;
  prerequisites?: string[];
  tags?: string[];
}

interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface PlatformStats {
  totalStudents: number;
  totalAITeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  recentEnrollments: number;
  revenue?: number;
}

interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const adminService = {
  // Get platform statistics
  getPlatformStats: async (): Promise<PlatformStats> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: PlatformStats }>("/api/admin/stats");
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Fetch Platform Stats");
      throw error;
    }
  },

  // User management
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<PaginationResult<User>> => {
    try {
      // Backend returns { success, data: User[], pagination: {...} }
      const response = await apiClient.get<any>("/api/users", { params });
      return {
        data: response.data.data,
        ...response.data.pagination
      };
    } catch (error) {
      handleApiError(error, "Fetch Users");
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: User }>(`/api/users/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Fetch User");
      throw error;
    }
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: User }>("/api/users", userData);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Create User");
      throw error;
    }
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: User }>(`/api/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Update User");
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/users/${id}`);
    } catch (error) {
      handleApiError(error, "Delete User");
      throw error;
    }
  },

  // Course management
  getCourses: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isApproved?: boolean;
  }): Promise<PaginationResult<Course>> => {
    try {
      const response = await apiClient.get<any>("/api/courses", { params });
      return {
        data: response.data.data,
        ...response.data.pagination
      };
    } catch (error) {
      handleApiError(error, "Fetch Courses");
      throw error;
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Course }>(`/api/courses/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Fetch Course");
      throw error;
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: Course }>("/api/courses", courseData);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Create Course");
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: Course }>(`/api/courses/${id}`, courseData);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Update Course");
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/courses/${id}`);
    } catch (error) {
      handleApiError(error, "Delete Course");
      throw error;
    }
  },

  // Payment management
  getPayments: async (params?: {
    page?: number;
    limit?: number;
    user?: string;
    course?: string;
    status?: string;
    method?: string;
    search?: string;
  }): Promise<PaginationResult<Payment>> => {
    try {
      const response = await apiClient.get<any>("/api/payments", { params });
      return {
        data: response.data.data,
        ...response.data.pagination
      };
    } catch (error) {
      handleApiError(error, "Fetch Payments");
      throw error;
    }
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Payment }>(`/api/payments/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Fetch Payment");
      throw error;
    }
  },

  updatePayment: async (id: string, paymentData: Partial<Payment>): Promise<Payment> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: Payment }>(`/api/payments/${id}`, paymentData);
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Update Payment");
      throw error;
    }
  },

  deletePayment: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/payments/${id}`);
    } catch (error) {
      handleApiError(error, "Delete Payment");
      throw error;
    }
  },

  // Registration management
  getPendingRegistrations: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>("/api/admin/registrations/pending");
      return response.data.data || [];
    } catch (error: any) {
      // Handle 404 specifically - it means no pending items
      if (error.response?.status === 404) {
        return [];
      }
      // Handle 401/403 - authentication issues
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error accessing pending registrations:", error);
        throw new Error("Unauthorized access to admin features");
      }
      handleApiError(error, "Fetch Pending Registrations");
      throw error;
    }
  },

  approveRegistration: async (id: string, note: string): Promise<any> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>(`/api/admin/registrations/${id}/approve`, { note });
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Approve Registration");
      throw error;
    }
  },

  rejectRegistration: async (id: string, reason: string): Promise<any> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>(`/api/admin/registrations/${id}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      handleApiError(error, "Reject Registration");
      throw error;
    }
  },
};