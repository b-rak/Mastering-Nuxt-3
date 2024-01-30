<template>
  <div>
    <p class="mt-0 uppercase font-bold text-slate-400 mb-1">
      Lesson {{ chapter.number }} - {{ lesson.number }}
    </p>
    <h2 class="my-0">{{ lesson.title }}</h2>
    <div class="flex space-x-4 mt-2 mb-8">
      <NuxtLink
        v-if="lesson.sourceUrl"
        class="font-normal text-md text-gray-500"
        :to="lesson.sourceUrl"
      >
        Download Source Code
      </NuxtLink>
      <NuxtLink
        v-if="lesson.downloadUrl"
        class="font-normal text-md text-gray-500"
        :to="lesson.downloadUrl"
      >
        Download Video
      </NuxtLink>
    </div>
    <VideoPlayer v-if="lesson.videoId" :videoId="lesson.videoId" />
    <p>{{ lesson.text }}</p>
    <!--<ClientOnly> this component will only be rendered on the client side. Useful when Hydration 
            leads to unexpected behaviour called 'hydration mistmatch' e.g. mixing up different element states from the client and the server -->
    <LessonCompleteButton
      v-if="user"
      :model-value="isCompleted"
      @update:model-value="toggleComplete"
    />
    <!--</ClientOnly> Instead using this tag-element we can also append the .client suffix 
        to the component file name-->
  </div>
</template>

<script setup>
import { useCourseProgress } from "~/stores/courseProgress.ts";
const course = await useCourse();
const route = useRoute();
const user = useSupabaseUser();
const { chapterSlug, lessonSlug } = route.params;
const lesson = await useLesson(chapterSlug, lessonSlug);
const store = useCourseProgress();
const { initialize, toggleComplete } = store;

initialize();

definePageMeta({
  middleware: [
    //both middleware functions here are inline middleware: the order of the definition is important since they are run after the other.
    //in our case, let's say we try to navigate to an endpoint with a not existing chapter 'aklsnflasd', then the first middleware function redirects to an error page: Since the redirect to the login page is the second middleware function, the user won't be redirected to the login page
    async function ({ params }, from) {
      const course = await useCourse();

      const chapter = course.value.chapters.find(
        (chapter) => chapter.slug === params.chapterSlug
      );

      if (!chapter) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: "Chapter not found",
          })
        );
      }

      const lesson = chapter.lessons.find(
        (lesson) => lesson.slug === params.lessonSlug
      );

      if (!lesson) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: "Lesson not found",
          })
        );
      }
    },
    "auth", //<-- named middleware: we did move the second middleware function to middleware/auth.ts; to use or call the named middleware we just need to write down the name of the middleware, in this case it is 'auth'
    //advantage: we can easily reuse the function at different places. We don't need to write down the logic every time. Calling the name of the function is enough
  ],
});

// Check if the current lesson is completed
const isCompleted = computed(() => {
  return store.progress?.[chapterSlug]?.[lessonSlug] || false;
});

const chapter = computed(() => {
  return course.value.chapters.find(
    (chapter) => chapter.slug === route.params.chapterSlug
  );
});

const title = computed(() => {
  return `${lesson.value.title} - ${course.value.title}`;
});

useHead({
  title,
});

const throwError = () => {
  throw createError("Could not update");
};
</script>
