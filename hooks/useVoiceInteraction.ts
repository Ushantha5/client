import { useState, useEffect, useCallback } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { callOpenAI, callGemini } from "@/lib/aiClient";
import { useTextToSpeech } from "./useTextToSpeech";

type AIProvider = "openai" | "gemini" | "mock";

export const useVoiceInteraction = (aiProvider: AIProvider = "openai") => {
	const [response, setResponse] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const { speak, isSpeaking } = useTextToSpeech();

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	const startListening = () =>
		SpeechRecognition.startListening({ continuous: true });
	const stopListening = () => SpeechRecognition.stopListening();

	const processMessage = useCallback(
		async (message: string) => {
			setIsProcessing(true);
			let aiResponse = "";

			try {
				switch (aiProvider) {
					case "openai":
						aiResponse = await callOpenAI(message);
						break;
					case "gemini":
						aiResponse = await callGemini(message);
						break;
					default:
						aiResponse = `You said: ${message}. I am your AI assistant powered by ${aiProvider}.`;
				}
			} catch (error) {
				aiResponse = "Sorry, I encountered an error processing your request.";
			}

			setResponse(aiResponse);
			speak(aiResponse);
			setIsProcessing(false);
		},
		[aiProvider, speak],
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
