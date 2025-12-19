// Deprecated: Use callGemini instead. Redirecting to Gemini.
export async function callOpenAI(message: string): Promise<string> {
	try {
		// We route legacy OpenAI calls to the Gemini endpoint for consistency
		const response = await fetch("/api/ai/gemini", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ 
				message,
				options: {
					temperature: 0.7,
					max_tokens: 1000
				}
			}),
		});

		if (!response.ok) throw new Error("AI API failed");

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("AI error (legacy openai call):", error);
		return "Sorry, I encountered an error with the AI service.";
	}
}

export async function callGemini(message: string, multimodal: boolean = false): Promise<string> {
	try {
		const response = await fetch("/api/ai/gemini", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ 
				message, 
				multimodal,
				options: {
					temperature: 0.7,
					max_tokens: 1000
				}
			}),
		});

		if (!response.ok) throw new Error("Gemini API failed");

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Gemini error:", error);
		return "Sorry, I encountered an error with Gemini.";
	}
}

// New function for multimodal interactions (images + text)
export async function callGeminiMultimodal(content: { text: string; images?: string[] }): Promise<string> {
	try {
		const messages = [{ role: "user", content }];
		const response = await fetch("/api/ai/gemini", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ 
				messages,
				multimodal: true,
				options: {
					temperature: 0.7,
					max_tokens: 1000
				}
			}),
		});

		if (!response.ok) throw new Error("Gemini Multimodal API failed");

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Gemini multimodal error:", error);
		return "Sorry, I encountered an error processing your multimodal input.";
	}
}