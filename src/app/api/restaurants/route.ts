'use server'

import { NextResponse } from "next/server";
import { type TRestaurant } from "@/app/_types/restaurant";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const restaurants: TRestaurant[] = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
      },
    });

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
  
}