import prisma from "@/lib/db";
import { type TOrderItem, type TOrderTypeProp } from '@/app/_types/orderItem';

const removeOrderItem = async ({ orderId, orderItems = [] }: { orderId: number; orderItems: TOrderTypeProp[] }) => {
  try {
    if (orderItems.length) {
      const data: TOrderItem[] = await prisma.orderItem.findMany({
        where: {
          AND: [
            { orderId },
            {
              menuItemId: { in: orderItems.map((orderItems: Partial<TOrderItem>) => orderItems.menuItemId || 0) }
            },
            { isDeleted: false }
          ]
        }
      });
      
      for(let i = 0; i < orderItems.length; i++) {
        const orderItem = data.find((oItem: Partial<TOrderItem>) => oItem.menuItemId === orderItems[i].menuItemId);

        if (orderItem?.id) {
          await prisma.orderItem.update({
            where: {
              id: orderItem.id
            },
            data: {
              isDeleted: true
            }
          });
        }
      }

      const updatedOrderItems: TOrderItem[]  = await prisma.orderItem.findMany({
        where: {
          AND: [
            { orderId },
            { isDeleted: false }
          ]
        }
      });

      let totalAmount = 0;

      for(let i = 0; i < updatedOrderItems.length; i++) {
        const { price, quantity } = updatedOrderItems[i];
        totalAmount+= price * quantity;
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          totalAmount,
          ...(totalAmount === 0 ? { status: 'canceled' }: {})
        },
      });

      if (totalAmount === 0) {
        return 'Your order was canceled because your total amount is now 0';
      }
      
      return `Your order #${orderId} was updated, your new total amount is ${totalAmount}`;
    }
    
    return 'There were no order items to updated';
  } catch (error) {
    console.log(error);
    return 'order update failed';
  }
}

export default removeOrderItem;