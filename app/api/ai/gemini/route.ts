import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize lazily to avoid build-time errors if env var is missing
const getGenAI = () => {
	const key = process.env.GEMINI_API_KEY || "";
	return new GoogleGenerativeAI(key);
};

export async function POST(request: NextRequest) {
	try {
		const { message, messages, options } = await request.json();

		// Handle both single message and messages array formats
		let prompt = "";
		if (messages && Array.isArray(messages)) {
			// Extract system message and user messages
			const systemMessage = messages.find(msg => msg.role === "system");
			const userMessages = messages.filter(msg => msg.role === "user" || msg.role === "assistant");

			// Build prompt with system instruction and conversation history
			if (systemMessage) {
				prompt += systemMessage.content + "\n\n";
			}

			// Add conversation history
			userMessages.forEach(msg => {
				prompt += `${msg.role === "user" ? "User" : "Assistant"}: ${typeof msg.content === "string" ? msg.content : msg.content.text}\n`;
			});
		} else if (message) {
			prompt = message;
		} else {
			return NextResponse.json(
				{ error: "Message or messages array is required" },
				{ status: 400 },
			);
		}

		const genAI = getGenAI();
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			generationConfig: {
				temperature: options?.temperature || 0.7,
				maxOutputTokens: options?.max_tokens || 1000,
			}
		});

		const result = await model.generateContent(prompt);
		const response = result.response.text();

		return NextResponse.json({ response });
	} catch (error) {
		console.error("Gemini API error:", error);
		return NextResponse.json(
			{ error: "Failed to get response from Gemini: " + (error as Error).message },
			{ status: 500 },
		);
	}
}
