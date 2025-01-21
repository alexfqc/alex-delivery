import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { z } from 'zod';
import { type TRestaurant } from "@/app/_types/restaurant";
import { type TItem } from "@/app/_types/item";

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
      getMenuItems: {
        description: 'what are the available menu items',
        parameters: z.object({
          restaurant: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
        execute: async ({ restaurant }) => {
          try {
            if (!restaurant) {
              return 'There are no menu items available at the moment';
            }

            const items: Partial<TItem>[] = await prisma.menuItem.findMany({
              where: {
                restaurantId: restaurant.id,
              }, 
              select: {
                id: true,
                name: true,
                price: true,
                foodTypes: true,
              }
            });

            const itemsName = items.map((item: Partial<TItem>) => `${item.name} for ${item.price}`);

            return `The menu items are ${itemsName.join(', ')}`;
          } catch (error) {
            console.log(error);
            return 'There are no menu items available at the moment';
          }
        },
      },
    }
  });

  return result.toDataStreamResponse();
}