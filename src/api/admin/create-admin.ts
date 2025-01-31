import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/auth";
import { z } from "zod";

const envSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8).max(32),
});

const env = envSchema.parse({
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
});

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.storeAdmin.findUnique({
    where: { email: env.ADMIN_EMAIL },
  });

  if (!admin) {
    await prisma.storeAdmin.create({
      data: {
        email: env.ADMIN_EMAIL,
        passwordHash: await hashPassword(env.ADMIN_PASSWORD),
        firstName: "Super",
        lastName: "Admin",
      },
    });
    console.log("Admin created with email:", env.ADMIN_EMAIL);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
