import { Prisma, PrismaClient } from '@prisma/client';

/* since it gonna run only once, there's no problem with using nenw PrismaClient() here */
const prisma = new PrismaClient();

async function main () {
  const foodTypes: Prisma.FoodTypeCreateInput[] = [
    {
      name: "Burger",
    },
    {
      name: "Chicken",
    },
    {
      name: "Gluten free",
    },
    {
      name: "Kids",
    },
    {
      name: "Spicy",
    },
    {
      name: "Dessert",
    },
    {
      name: "Beverage",
    },
    {
      name: "Veggie",
    }
  ];

  foodTypes.forEach(async (foodType) => {
    await prisma.foodType.create({
      data: foodType
    });
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "McDonald's",
      description: "McDonald's Corporation, doing business as McDonald's, is an American multinational fast food chain, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, California, United States.",
    }
  });

  const menuItems: Prisma.MenuItemCreateInput[] = [
    {
      name: "Big Mac",
      description: "The Big Mac is a hamburger sold by international fast food restaurant chain McDonald's.",
      price: 3.99,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Burger",
        }
      }
    },
    {
      name: "McChicken",
      description: "The McChicken is a chicken sandwich sold by the international fast-food restaurant chain McDonald's.",
      price: 1.29,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Chicken",
        }
      }
    },
    {
      name: "Large Fries",
      description: "McDonald's French Fries are a popular menu item at McDonald's.",
      price: 1.29,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Gluten free",
        }
      }
    },
    {
      name: "Happy Meal",
      description: "The Happy Meal is a kids' meal sold at the fast-food chain McDonald's since June 1979.",
      price: 4.99,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Kids",
        }
      }
    },
    {
      name: "Spicy Chicken",
      description: "The Spicy Chicken is a spicy chicken sandwich sold by the international fast-food restaurant chain McDonald's.",
      price: 1.79,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Spicy",
        }
      }
    },
    {
      name: "Milkshake",
      description: "A milkshake is a sweet, cold beverage which is usually made from milk, ice cream, or iced milk, and flavorings or sweeteners such as butterscotch, caramel sauce, chocolate syrup, or fruit syrup.",
      price: 2.99,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Dessert",
        }
      }
    },
    {
      name: "Soda",
      description: "A soda is a carbonated soft drink flavored with various syrups.",
      price: 1.50,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Beverage",
        }
      }
    },
    {
      name: "Baked Apple Pie",
      description: "The Baked Apple Pie is a dessert item sold at McDonald's.",
      price: 1.00,
      restaurant: {
        connect: {
          id: restaurant.id,
        }
      },
      foodTypes: {
        connect: {
          name: "Dessert",
        }
      }
    }
  ];

  menuItems.forEach(async (menuItem) => {
    await prisma.menuItem.create({
      data: menuItem
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1)
  });