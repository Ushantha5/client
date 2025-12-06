import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

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
