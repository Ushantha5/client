/* eslint-disable */
const axios = require('axios');
require('dotenv').config();

// Use backend port directly
const API_URL = "http://localhost:5000/api";
// Uses the admin email/pass we set in seedAdmin.js or similar defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mr5school.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

const sampleCourses = [
    {
        title: "Advanced React Patterns",
        description: "Master advanced React concepts including HOCs, Render Props, and Custom Hooks.",
        category: "Programming",
        level: "Advanced",
        price: 49.99,
        language: "English",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
        tags: ["react", "frontend", "javascript"],
        prerequisites: ["Basic React", "JavaScript ES6"]
    },
    {
        title: "Machine Learning with Python",
        description: "A comprehensive guide to ML using Scikit-Learn and TensorFlow.",
        category: "Data Science",
        level: "Intermediate",
        price: 59.99,
        language: "English",
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop",
        tags: ["python", "ai", "machine learning"],
        prerequisites: ["Python Basics", "Linear Algebra"]
    },
    {
        title: "Sinhala Literature Basics",
        description: "Introduction to classic Sinhala literature and poetry.",
        category: "Humanities",
        level: "Beginner",
        price: 29.99,
        language: "Sinhala",
        thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop",
        tags: ["sinhala", "literature", "history"],
        prerequisites: []
    }
];

async function seed() {
    try {
        console.log("Logging in as admin...");
        // 1. Login to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        // Handling both possible response structures for flexibility. 
        // Based on authController, it returns data.accessToken (Phase 1)
        // or cookies (Phase 2), but let's assume we can grab it from response or cookie header if needed.
        // Actually, our API client uses cookies. But here in a script, we need to manually handle headers unless we use a cookie jar.
        // The /login endpoint returns { success: true, data: { accessToken: ... } } usually.

        const token = loginRes.data.data?.accessToken;
        const userId = loginRes.data.data?.user?.id;

        if (!token || !userId) {
            console.error("Login failed: No access token or user ID returned.");
            // If strictly cookie-based, we'd need to parse 'set-cookie'.
            // Let's print headers to debug if this fails.
            // console.log(loginRes.headers);
            return;
        }

        console.log("Logged in successfully. Seeding courses...");

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        for (const course of sampleCourses) {
            try {
                // Course controller expects body with course data
                // teacher field is required by validatin.
                const courseData = { ...course, teacher: userId, isApproved: true };

                await axios.post(`${API_URL}/courses`, courseData, config);
                console.log(`Created course: ${course.title}`);
            } catch (err) {
                console.error(`Failed to create ${course.title}:`, err.response?.data || err.message);
            }
        }
        console.log("Seeding complete!");

    } catch (error) {
        console.error("Seeding Error:", error.response?.data || error.message);
    }
}

seed();
