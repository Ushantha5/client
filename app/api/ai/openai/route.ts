import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
		// Using gemini-1.5-flash as the replacement for GPT-4 for speed/efficiency in this context
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const systemPrompt = "You are a helpful AI tutor for MR5 School. Provide concise, educational responses.";
		// Prepend system prompt to message for simple chat turn
		const fullMessage = `${systemPrompt}\n\nUser: ${message}`;

		const result = await model.generateContent(fullMessage);
		const response = result.response.text();

		return NextResponse.json({ response });
	} catch (error) {
		console.error("Gemini (via OpenAI route) API error:", error);
		return NextResponse.json(
			{ error: "Failed to get response from AI service" },
			{ status: 500 },
		);
	}
}
