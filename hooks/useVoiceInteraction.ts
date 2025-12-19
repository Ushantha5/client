import { useState, useEffect, useCallback } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { callOpenAI, callGemini, callGeminiMultimodal } from "@/lib/aiClient";
import { useTextToSpeech } from "./useTextToSpeech";
import { useRegionalSettings } from "@/contexts/RegionalSettingsContext";

type AIProvider = "openai" | "gemini" | "mock";

// Define types for better type safety
interface MessageContent {
  text: string;
  images?: string[];
}

export const useVoiceInteraction = (aiProvider: AIProvider = "gemini") => {
	const [response, setResponse] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const { speak, isSpeaking } = useTextToSpeech();
	const { settings } = useRegionalSettings();

	const lang = settings?.language?.split(',')[0].trim().substring(0, 5) || "en-US";

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	const startListening = () =>
		SpeechRecognition.startListening({ continuous: true, language: lang });
	const stopListening = () => SpeechRecognition.stopListening();

	const processMessage = useCallback(
		async (message: string | MessageContent) => {
			setIsProcessing(true);
			let aiResponse = "";

			try {
				// Check if message is multimodal (has images)
				if (typeof message === "object" && message.images && message.images.length > 0) {
					// Use multimodal AI service
					aiResponse = await callGeminiMultimodal(message);
				} else {
					// Use regular text-based AI service
					const textMessage = typeof message === "string" ? message : message.text;
					switch (aiProvider) {
						case "openai":
							aiResponse = await callOpenAI(textMessage);
							break;
						case "gemini":
							aiResponse = await callGemini(textMessage);
							break;
						default:
							aiResponse = `You said: ${textMessage}. I am your AI assistant powered by ${aiProvider}.`;
					}
				}
			} catch (_error) {
				aiResponse = "Sorry, I encountered an error processing your request.";
			}

			setResponse(aiResponse);
			speak(aiResponse, "web", lang);
			setIsProcessing(false);
		},
		[aiProvider, speak, lang],
	);

	useEffect(() => {
		if (!listening && transcript && !isProcessing) {
			processMessage(transcript);
			resetTranscript();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listening]);

	return {
		transcript,
		listening,
		startListening,
		stopListening,
		response,
		isSpeaking: isSpeaking || isProcessing,
		isProcessing,
		browserSupportsSpeechRecognition,
	};
};