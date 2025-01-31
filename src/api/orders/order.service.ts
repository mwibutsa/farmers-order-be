import { DatabaseError } from "#lib/errors";
import { OrderModel, LandModel, SeedModel, FertilizerModel } from "#/models";
import { prisma } from "#lib/prisma";
import { OrderStatus } from "@prisma/client";

export interface CreateOrderInput {
  landId: number;
  seedId?: number;
  fertilizerId?: number;
}

export default class OrderService {
  static async create(farmerId: number, data: CreateOrderInput) {
    const { landId, seedId, fertilizerId } = data;

    try {
      const land = await LandModel.findUnique({
        where: { id: landId },
        include: { orders: true },
      });

      if (!land || land.farmerId !== farmerId) {
        throw new DatabaseError("Invalid land selected");
      }

      let seed, fertilizer;
      if (seedId) {
        seed = await SeedModel.findUnique({ where: { id: seedId } });
        if (!seed) throw new DatabaseError("Invalid seed selected");
      }

      if (fertilizerId) {
        fertilizer = await FertilizerModel.findUnique({
          where: { id: fertilizerId },
          include: { seedTypes: true },
        });
        if (!fertilizer) throw new DatabaseError("Invalid fertilizer selected");

        // Check compatibility if both seed and fertilizer are selected
        if (seed && !fertilizer.seedTypes.some((s) => s.id === seed.id)) {
          throw new DatabaseError(
            "Selected fertilizer is not compatible with the seed",
          );
        }
      }

      // Calculate quantities and total amount
      const seedQuantity = seed ? land.landSize * seed.kgPerAcre : 0;
      const fertilizerQuantity = fertilizer
        ? land.landSize * fertilizer.kgPerAcre
        : 0;

      const totalAmount =
        (seed ? seedQuantity * seed.pricePerKg : 0) +
        (fertilizer ? fertilizerQuantity * fertilizer.pricePerKg : 0);

      return await prisma.order.create({
        data: {
          farmerId,
          landId,
          totalAmount,
          orderDetails: {
            create: [
              ...(seed
                ? [
                    {
                      seedId: seed.id,
                      quantity: seedQuantity,
                      price: seed.pricePerKg,
                    },
                  ]
                : []),
              ...(fertilizer
                ? [
                    {
                      fertilizerId: fertilizer.id,
                      quantity: fertilizerQuantity,
                      price: fertilizer.pricePerKg,
                    },
                  ]
                : []),
            ],
          },
        },
        include: {
          orderDetails: {
            include: {
              seed: true,
              fertilizer: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to create order: ${(error as Error).message}`,
      );
    }
  }

  static async getFarmerOrders(farmerId: number, page = 1, limit = 5) {
    return OrderModel.findMany({
      where: { farmerId },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
      include: {
        orderDetails: {
          include: {
            seed: true,
            fertilizer: true,
          },
        },
      },
    });
  }

  static async getAllPendingOrders(page = 1, limit = 5) {
    return OrderModel.findMany({
      where: { status: "PENDING" },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
      include: {
        farmer: true,
        land: true,
        orderDetails: {
          include: {
            seed: true,
            fertilizer: true,
          },
        },
      },
    });
  }

  static async updateOrderStatus(orderId: number, status: OrderStatus) {
    return OrderModel.update({
      where: { id: orderId },
      data: { status },
    });
  }

  static async getOrderById(orderId: number) {
    return OrderModel.findUnique({ where: { id: orderId } });
  }
}
