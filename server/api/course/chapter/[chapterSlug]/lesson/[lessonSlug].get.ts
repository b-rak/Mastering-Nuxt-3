import { PrismaClient } from "@prisma/client";
import protectRoute from "~/server/utils/protectRoute";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // We allow users to access the first chapter without being logged in
  if (event.context.params?.chapterSlug !== "1-chapter-1") {
    protectRoute(event);
  }

  const { chapterSlug, lessonSlug } = event.context.params as Record<
    string,
    string
  >;

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lesson not found",
    });
  }

  return {
    ...lesson,
    path: `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
