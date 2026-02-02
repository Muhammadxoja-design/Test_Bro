export type TutorResponse = {
  reply: string;
  mode: "mock" | "provider";
};

export async function sendTutorPrompt(prompt: string): Promise<TutorResponse> {
  const providerKey = process.env.OPENAI_API_KEY;
  if (!providerKey) {
    return { reply: "Mock tutor response. Provide your question and I can help break it down.", mode: "mock" };
  }

  // Provider integration placeholder. Keep behind single adapter file.
  return { reply: "Provider integration not configured yet.", mode: "provider" };
}
