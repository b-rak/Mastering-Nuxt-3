<template>
  <div v-if="user" class="rounded p-3 flex items-center space-x-3 bg-white">
    <img
      :src="profile"
      alt="Profile"
      class="rounded-full w-12 h-12 border-2 border-blue-400"
    />
    <div class="text-right">
      <div class="font-medium">{{ name }}</div>
      <button class="text-sm underline text-slate-500" @click="logout">
        Log out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  // The Nuxt Supabase auth *should* be doing this for us,
  // but it isn't for some reason.
  // Tell Supabase that we are signed out; and set the user value to null
  try {
    await $fetch("/api/_supabase/session", {
      method: "POST",
      body: { event: "SIGNED_OUT", session: null },
    });
    user.value = null;
  } catch (e) {
    console.error(e);
  }

  await navigateTo("/login");
};

const name = computed(() => user.value?.user_metadata.full_name);
const profile = computed(() => user.value?.user_metadata.avatar_url);
</script>
