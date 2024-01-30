export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { data: hasAccess } = await useFetch("/api/user/hasAccess", {
    headers: useRequestHeaders(["cookie"]),
  });

  // let navigation happen -> first chapter is for free
  if (hasAccess.value || to.params.chapterSlug === "1-chapter-1") {
    return;
  } else if (user.value && !hasAccess.value) {
    // Prevent logging in with Github if user has not purchased course
    const client = useSupabaseClient();
    await client.auth.signOut();
  }
  // for all other chapters redirect to the login page
  return navigateTo(`/login?redirectTo=${to.path}`);
});
