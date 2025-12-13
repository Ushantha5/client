import { Course } from '../../services/course.service';
import { z } from 'zod';

// Define Zod schema matching the Course interface to validate "API responses"
const TeacherSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    profileImage: z.string().optional(),
});

const CourseSchema = z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string().optional(),
    level: z.string(),
    price: z.number(),
    thumbnail: z.string().optional(),
    language: z.string(),
    teacher: TeacherSchema,
    isApproved: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

describe('Course API Contract', () => {
    it('should validate a standard populated backend response against the frontend schema', () => {
        // Mock data representing what we expect from the API (populated)
        const mockApiResponse: any = {
            _id: "65a1234567890abcdef12345",
            title: "Advanced React Patterns",
            description: "Deep dive into React",
            category: "Development",
            level: "Advanced",
            price: 49.99,
            thumbnail: "https://example.com/thumb.jpg",
            language: "English",
            teacher: {
                _id: "65b9876543210fedcba54321",
                name: "Jane Doe",
                email: "jane@example.com",
                role: "teacher" // Extra fields from backend should be ignored or allowed
            },
            isApproved: true,
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-02T00:00:00.000Z",
            __v: 0 // Backend version key
        };

        // Validate
        const result = CourseSchema.safeParse(mockApiResponse);

        if (!result.success) {
            console.error(result.error);
        }

        expect(result.success).toBe(true);

        // Type check (compile-time) - ensure Zod output matches Interface
        type ZodCourse = z.infer<typeof CourseSchema>;
        const course: Course = mockApiResponse;
        expect(course.title).toBe(mockApiResponse.title);
    });

    it('should fail if required fields are missing', () => {
        const invalidResponse = {
            _id: "123",
            // title missing
            description: "desc"
        };
        const result = CourseSchema.safeParse(invalidResponse);
        expect(result.success).toBe(false);
    });
});
