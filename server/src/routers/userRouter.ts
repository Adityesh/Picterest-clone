import { router, procedure } from "../trpc";
import { User } from "../prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  registerUser: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(5),
      })
    )
    .mutation(async (req) => {
      const {
        input: { email, name, password },
      } = req;
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      return await User.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
        select: {
          email: true,
          createdAt: true,
          id: true,
          name: true,
          updatedAt: true,
        },
      });
    }),


  // Login user with either email or name as the primary input
  loginUser: procedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string(),
      })
    )
    .mutation(async (req) => {
        const { input : { email, name, password }} = req

        if(!email && !name) throw new TRPCError({
            code : "BAD_REQUEST",
            message : "Email or Name wasn't provided"
        })

        let query : any = {}

        if(email)  query.email = email

        if(name) query.name = name
        
        const doesUserExist = await User.findUniqueOrThrow({
            where : query
        })

        const isPasswordValid = await bcrypt.compare(password, doesUserExist.password);

        if(!isPasswordValid) {
            throw new TRPCError({
                code : "UNAUTHORIZED",
                message : "Invalid credentials"
            })
        }
        
    }),
});
