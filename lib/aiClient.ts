export async function callOpenAI(message: string): Promise<string> {
	try {
		const response = await fetch("/api/ai/openai", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message }),
		});

		if (!response.ok) throw new Error("OpenAI API failed");

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("OpenAI error:", error);
		return "Sorry, I encountered an error with OpenAI.";
	}
}

export async function callGemini(message: string): Promise<string> {
	try {
		const response = await fetch("/api/ai/gemini", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message }),
		});

		if (!response.ok) throw new Error("Gemini API failed");

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Gemini error:", error);
		return "Sorry, I encountered an error with Gemini.";
	}
}
