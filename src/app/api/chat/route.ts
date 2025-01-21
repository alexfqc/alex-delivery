import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { z } from 'zod';
import { type TRestaurant } from "@/app/_types/restaurant";
import { type TItem, type TFoodType } from "@/app/_types/item";
import { type TOrder } from "@/app/_types/order";
import updateOrderItem from './updateOrderItem';
import addOrderItem from './addOrderItem';
import removeOrderItem from './removeOrderItem';

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

            if (!restaurants.length) {
              return 'There are no restaurants available at the moment';
            }
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
          foodTypeName: z.string().optional(),
        }),
        execute: async ({ restaurant, foodTypeName }) => {
          try {
            if (!restaurant) {
              return 'There are no menu items available at the moment';
            }

            const foodType: TFoodType | null =  foodTypeName ? await prisma.foodType.findFirst({
              where: {
                name: foodTypeName,
              },
            }) : null;

            const items: Partial<TItem>[] = await prisma.menuItem.findMany({
              where: {
                restaurantId: restaurant.id,
                ...(foodType ? { foodTypes: { some: { id: foodType.id } }} : {}),
              }, 
              select: {
                id: true,
                name: true,
                price: true,
                foodTypes: true,
              }
            });

            if (!items.length) {
              return `There are no menu items available ${foodTypeName ? `for ${foodTypeName} `: ''}at the moment`;
            }

            const itemsName = items.map((item: Partial<TItem>) => `${item.name} for ${item.price} [${item.foodTypes?.map((foodType: TFoodType) => foodType.name).join(', ')}]`);

            return `The menu items are ${itemsName.join(', ')}`;
          } catch (error) {
            console.log(error);
            return 'There are no menu items available at the moment';
          }
        },
      },
      placeOrder: {
        description: 'place an order from selected restaurant',
        parameters: z.object({
          restaurant: z.object({
            id: z.number(),
            name: z.string(),
          }),
          orderItems: z.array(
            z.object({
              menuItemId: z.number(),
              price: z.number(),
              quantity: z.number()
          })
          ),
        }),
        execute: async ({ restaurant, orderItems }) => {
          try {

            
            const user = await prisma.user.findFirst({
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            });
            
            let totalAmount = 0;
            
            if (user) {
              for(let i = 0; i < orderItems.length; i++) {
                const { price, quantity } = orderItems[i];
                totalAmount+= price * quantity;
              }
              
              const createdOrder: TOrder = await prisma.order.create({
                data: {
                  userId: user.id,
                  restaurantId: restaurant.id,
                  status: 'created',
                  totalAmount,
                  orderItems: {
                    createMany: {
                      data: orderItems
                    }
                  }
                }
              });

              return `Your order id is #${createdOrder.id} and the total is ${totalAmount}`;
            }
            

            return 'There was a problem on ondering your items';
            
          } catch (error) {
            console.log(error)
            return 'There was a problem on ordering your items';
          }
        },
      },
      updateOrder: {
        description: 'update quantity of items from an order already created',
        parameters: z.object({
          orderId: z.number(),
          orderItems: z.array(
            z.object({
              menuItemId: z.number(),
              name: z.string(),
              quantity: z.number(),
              price: z.number(),
            }),
          ),
          operationType: z.enum(['create', 'update', 'remove'])
        }),
        execute: async ({ orderId, orderItems, operationType }) => {
          if (operationType === 'update') {
            const message = updateOrderItem({ orderId, orderItems });
            return message;
          } else if (operationType === 'create') {
            const message = addOrderItem({ orderId, orderItems });
            return message;
          } else if (operationType === 'remove') {
            const message = removeOrderItem({ orderId, orderItems });
            return message;
          }
      } 
      }
    }
  });

  return result.toDataStreamResponse();
}