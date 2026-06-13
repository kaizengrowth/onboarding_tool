import type { LLMMessage, LLMProvider, LLMResponse } from "../index";

// OpenAI-compatible endpoint served by `llama.cpp --server`
export class LlamaCppProvider implements LLMProvider {
  private baseUrl = process.env.LLAMACPP_BASE_URL ?? "http://localhost:8080/v1";
  private apiKey = process.env.LLAMACPP_API_KEY ?? "none";

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ messages, max_tokens: 1024 }),
    });
    if (!res.ok) throw new Error(`llama.cpp error ${res.status}`);
    const data = await res.json();
    return { content: data.choices[0].message.content };
  }
}
