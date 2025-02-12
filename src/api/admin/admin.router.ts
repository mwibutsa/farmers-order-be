import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { prisma } from "#lib/prisma";
import { comparePassword, generateTokens } from "#utils/auth";
import { asyncErrorHandler } from "#middleware/errorHandler";

const adminRouter = Router();

adminRouter.post(
  "/login",
  celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await prisma.storeAdmin.findUnique({
      where: { email },
    });

    if (!admin || !(await comparePassword(password, admin.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateTokens({
      userId: admin.id,
      phoneNumber: admin.email,
      isAdmin: true,
    });

    return res.json({ data: token });
  }),
);

export default adminRouter;
