import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from "next/server";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: NextRequest) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant at a delivery app named Alex Delivery',
    messages,
  });

  return result.toDataStreamResponse();
}