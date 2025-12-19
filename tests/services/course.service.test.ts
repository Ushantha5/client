import { courseService, Course } from '@/services/course.service';
import apiClient from '@/lib/apiClient';
// Use jest.mocked for typed mocks
import { mocked } from 'jest-mock';

jest.mock('@/lib/apiClient');

// Directly cast apiClient to a mocked version
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('courseService', () => {
    const mockCourse: Course = {
        _id: 'course123',
        title: 'Intro to Huly Aesthetic',
        description: 'Learn the Huly design system.',
        category: 'Design',
        level: 'Beginner',
        price: 0,
        thumbnail: '/images/course-thumb.png',
        language: 'en',
        teacher: {
            _id: 'teacher1',
            name: 'Jane Doe',
            email: 'jane@example.com',
            profileImage: '/images/jane.png',
        },
        isApproved: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all courses', async () => {
        const response = { data: { success: true, data: [mockCourse], total: 1, page: 1, limit: 10, totalPages: 1 } };
        mockedApi.get.mockResolvedValueOnce(response as any);

        const result = await courseService.getAllCourses({ page: 1, limit: 10 });
        expect(mockedApi.get).toHaveBeenCalledWith('/api/courses', { params: { page: 1, limit: 10 } });
        expect(result).toEqual(response.data);
    });

    it('should fetch a course by id', async () => {
        const response = { data: { success: true, data: mockCourse } };
        mockedApi.get.mockResolvedValueOnce(response as any);

        const result = await courseService.getCourseById('course123');
        expect(mockedApi.get).toHaveBeenCalledWith('/api/courses/course123');
        expect(result).toEqual(response.data);
    });

    it('should create a new course', async () => {
        const response = { data: { success: true, data: mockCourse } };
        mockedApi.post.mockResolvedValueOnce(response as any);

        const result = await courseService.createCourse({ title: mockCourse.title, description: mockCourse.description, level: mockCourse.level, price: mockCourse.price, language: mockCourse.language });
        expect(mockedApi.post).toHaveBeenCalledWith('/api/courses', expect.any(Object));
        expect(result).toEqual(response.data);
    });
});
