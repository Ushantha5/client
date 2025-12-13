import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize lazily to avoid build-time errors if env var is missing
const getGenAI = () => {
	const key = process.env.GEMINI_API_KEY || "";
	return new GoogleGenerativeAI(key);
};

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

		const genAI = getGenAI();
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });

		const result = await model.generateContent([
			"You are a helpful AI tutor for MR5 School. Provide concise, educational responses.",
			message,
		]);

		const response = result.response.text();

		return NextResponse.json({ response });
	} catch (error) {
		console.error("Gemini API error:", error);
		return NextResponse.json(
			{ error: "Failed to get response from Gemini" },
			{ status: 500 },
		);
	}
}
