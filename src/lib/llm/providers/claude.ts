import Anthropic from "@anthropic-ai/sdk";
import type { LLMMessage, LLMProvider, LLMResponse } from "../index";

export class ClaudeProvider implements LLMProvider {
  private client = new Anthropic();

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const system = messages.find((m) => m.role === "system")?.content;
    const conversation = messages.filter((m) => m.role !== "system");

    const response = await this.client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: conversation.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const block = response.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type from Claude");
    return { content: block.text };
  }
}
