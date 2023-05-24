// global middlewares are good for tracking and logging cases e.g. the analytics tracking can be done with this for the application
export default defineNuxtRouteMiddleware((to, from) => {
  const navigationHistory = useLocalStorage("history", []);
  navigationHistory.value.push(to.path);
});
