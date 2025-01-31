import { prisma } from "#lib/prisma";

export const FarmerModel = prisma.farmer;
export const FertilizerModel = prisma.fertilizer;
export const SeedModel = prisma.seed;
export const OrderModel = prisma.order;
export const OrderDetailsModel = prisma.orderDetails;
export const LandModel = prisma.land;
export const StoreAdmin = prisma.storeAdmin;
