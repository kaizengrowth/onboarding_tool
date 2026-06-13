export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
}

export interface LLMProvider {
  chat(messages: LLMMessage[]): Promise<LLMResponse>;
}

// All LLM calls go through this factory — swap provider via LLM_PROVIDER env var.
// Claude API now; llama.cpp on owned hardware when data sovereignty requires it.
export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "claude";
  if (provider === "llamacpp") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LlamaCppProvider } = require("./providers/llamacpp");
    return new LlamaCppProvider();
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ClaudeProvider } = require("./providers/claude");
  return new ClaudeProvider();
}
