import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const transaction = prisma.$transaction

export const User = prisma.user;
export const Pin = prisma.pin;
export const PinUserLikes = prisma.pinUserLikes;
