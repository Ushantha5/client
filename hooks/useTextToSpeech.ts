import { useState, useCallback } from "react";

export const useTextToSpeech = () => {
	const [isSpeaking, setIsSpeaking] = useState(false);

	const speak = useCallback(
		(text: string, voice: "web" | "elevenlabs" = "web") => {
			if (typeof window === "undefined") return;

			if (voice === "web" && window.speechSynthesis) {
				// Web Speech API
				setIsSpeaking(true);
				const utterance = new SpeechSynthesisUtterance(text);
				utterance.onend = () => setIsSpeaking(false);
				utterance.onerror = () => setIsSpeaking(false);
				window.speechSynthesis.speak(utterance);
			} else if (voice === "elevenlabs") {
				// TODO: Integrate ElevenLabs API
				console.log("ElevenLabs TTS not yet implemented");
				// Fallback to web speech
				if (window.speechSynthesis) {
					setIsSpeaking(true);
					const utterance = new SpeechSynthesisUtterance(text);
					utterance.onend = () => setIsSpeaking(false);
					utterance.onerror = () => setIsSpeaking(false);
					window.speechSynthesis.speak(utterance);
				}
			}
		},
		[],
	);

	const stop = useCallback(() => {
		if (typeof window !== "undefined" && window.speechSynthesis) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		}
	}, []);

	return { speak, stop, isSpeaking };
};
