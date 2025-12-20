import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize lazily to avoid build-time errors if env var is missing
const getGenAI = () => {
	const key = process.env.GEMINI_API_KEY;
	if (!key) {
		throw new Error("GEMINI_API_KEY environment variable is not configured");
	}
	return new GoogleGenerativeAI(key);
};

export async function POST(request: NextRequest) {
	try {
		// Check for API key first
		if (!process.env.GEMINI_API_KEY) {
			return NextResponse.json(
				{ error: "AI service is not configured. Please contact support." },
				{ status: 503 },
			);
		}

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

		// 1. Define fallback models in order of preference (Updated for 2025 environment)
		const modelsToTry = [
			"gemini-3-flash-preview",
			"gemini-2.5-flash-preview-09-2025",
			"gemini-3-pro-preview",
			"gemini-1.5-flash", // Keep legacy just in case
			"gemini-pro"
		];

		let lastError: any;
		let responseText: string | null = null;

		// 2. Iterate and try
		for (const modelName of modelsToTry) {
			try {
				const model = genAI.getGenerativeModel({
					model: modelName,
					generationConfig: {
						temperature: options?.temperature || 0.7,
						maxOutputTokens: options?.max_tokens || 1000,
					}
				});

				const result = await model.generateContent(prompt);
				const response = await result.response;
				responseText = response.text();

				// If we succeed, break the loop
				if (responseText) break;

			} catch (error: any) {
				lastError = error;
				// Only retry on 404 (Not Found) or 400 (Bad Request - typically model mismatch)
				const isModelError = error.message?.includes("404") || error.message?.includes("not found") || error.message?.includes("unsupported");

				if (isModelError) {
					console.warn(`Gemini model '${modelName}' failed (not found/supported). Trying next fallback...`);
					continue;
				}

				// If it's another error (e.g. Quota, API Key, 500), throw immediately
				throw error;
			}
		}

		// 3. If all attempts fail, try to help debug by listing models (if possible)
		if (!responseText) {
			console.error("All model fallbacks failed.");
			// Optional: Try to list models to help debugging
			// try {
			// 	 const models = await genAI.listModels();
			// 	 console.log("Available models:", models);
			// } catch (e) { /* ignore list error */ }

			throw lastError || new Error("Failed to generate content with any available model.");
		}

		return NextResponse.json({ response: responseText });
	} catch (error) {
		console.error("Gemini API error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Failed to get response from AI: " + errorMessage },
			{ status: 500 },
		);
	}
}

