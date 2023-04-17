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
        <VideoPlayer
            v-if="lesson.videoId"
            :videoId="`${lesson.videoId}`"
        />
        <p>{{ lesson.text }}</p>
        <!--<ClientOnly> this component will only be rendered on the client side. Useful when Hydration 
            leads to unexpected behaviour called 'hydration mistmatch' e.g. mixing up different element states from the client and the server -->
            <LessonCompleteButton 
                :model-value="isLessonComplete"
                @update:model-value="toggleComplete"
            />
        <!--</ClientOnly> Instead using this tag-element we can also append the .client suffix 
        to the component file name-->
    </div>
</template>


<script setup>
    const course = useCourse();
    const route = useRoute();

    const chapter = computed(() => {
        return course.chapters.find(
            (chapter) => chapter.slug === route.params.chapterSlug
        );
    });

    const lesson = computed(() => {
        console.log(chapter)
        return chapter.value.lessons.find(
            (lesson) => lesson.slug === route.params.lessonSlug
        );
    });

    const title = computed(() => {
        return `${lesson.value.title} - ${course.title}`;
    });

    useHead({
        title,
    });

    const progress = useLocalStorage('progress', []);

    const isLessonComplete = computed(() => {
        if (!progress.value[chapter.value.number - 1]) {
            return false;
        }

        if (!progress.value[chapter.value.number - 1][lesson.value.number - 1]) {
            return false;
        }

        return progress.value[chapter.value.number - 1][lesson.value.number - 1];
    });

    const toggleComplete = () => {
        if (!progress.value[chapter.value.number - 1]) {
            progress.value[chapter.value.number - 1] = [];
        }

        progress.value[chapter.value.number - 1][lesson.value.number - 1] = !isLessonComplete.value
    };
</script>