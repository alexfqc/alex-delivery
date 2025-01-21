import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from "next/server";
import { z } from 'zod';
import { type TRestaurant } from "@/app/_types/restaurant";

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
    tools: {
      getRestaurants: {
        description: 'what are the available restaurants',
        parameters: z.object({}),
        execute: async () => {
          try {
            const response = await fetch(`${process.env.BASE_URL}/api/restaurants`);

            const restaurants: TRestaurant[] = await response.json();

            return `The restaurants available are: ${restaurants.map((restaurant: TRestaurant) => restaurant.name).join(', ')}. Which restaurant would you like to order from?`;
          } catch (error) {
            console.log(error)
            return 'There are no restaurants available at the moment';
          }
        },
      },
    }
  });

  return result.toDataStreamResponse();
}