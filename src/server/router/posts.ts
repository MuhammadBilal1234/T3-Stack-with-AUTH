import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postRouter = createProtectedRouter()
  .query("getPosts", {
    input: z.object({
      page: z.number(),
      pageSize: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { page, pageSize } = input;
      const userId = ctx.session.user.id;

      const totalCount = await ctx.prisma.post.count();

      const data = await ctx.prisma.post.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: {
          author: userId,
        },
      });

      return { data, totalCount };
    },
  })
  .query("getSinglePost", {
    input: z.string(),
    async resolve({ ctx, input }) {
      if (input == "new") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Creating the Post",
        });
      }

      const singlePost = await ctx.prisma.post.findFirst({
        where: {
          id: input,
        },
      });

      if (!singlePost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not Found",
        });
      }

      return singlePost;
    },
  })
  .mutation("createPosts", {
    input: z.object({
      title: z.string().max(50),
      description: z.string().max(500),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;
      const { title, description } = input;

      const post = await ctx.prisma.post.create({
        data: {
          title,
          description,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return post;
    },
  })
  .mutation("editPosts", {
    input: z.object({
      id: z.string(),
      title: z.string().max(50),
      description: z.string().max(500),
    }),
    async resolve({ ctx, input }) {
      const { id, title, description } = input;
      const post = await ctx.prisma.post.update({
        data: {
          title,
          description,
        },
        where: {
          id: id,
        },
      });

      return post;
    },
  })
  .mutation("deletePosts", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    },
  });
