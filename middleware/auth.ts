export default defineNuxtRouteMiddleware((to, from) => {
  // let navigation happen -> first chapter is for free
  if (to.params.chapterSlug === "1-chapter-1") {
    return;
  }
  // for all other chapters redirect to the login page
  return navigateTo("/login");
});
