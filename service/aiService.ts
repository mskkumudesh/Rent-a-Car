import { GEMINI_API_KEY, GEMINI_MODEL } from "../config/aiConfig";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export type ChatMessage = { role: "user" | "model"; text: string };

export async function askAboutVehicle(
  systemInstruction: string,
  history: ChatMessage[]
): Promise<string> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("The assistant didn't return a response. Try again.");
  return text;
}
