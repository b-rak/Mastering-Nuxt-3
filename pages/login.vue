<template>
  <div class="prose w-full max-w-2xl h-9 flex flex-col" v-if="loginButtons">
    <h1>Log in to {{ course.title }}</h1>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded my-1"
      @click="login"
    >
      Log in with Github
    </button>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded my-1"
      @click="changeLogin('login')"
    >
      Log in with Email
    </button>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded my-1"
      @click="changeLogin('register')"
    >
      Register
    </button>
  </div>

  <div class="prose w-full max-w-2xl h-9 flex flex-col" v-else-if="loginForm">
    <h2>Login</h2>
    <form @submit.prevent="loginEmail">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <button
          type="submit"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-1 my-1"
        >
          Log in
        </button>
        <button
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-1 my-1"
          @click="changeLogin('buttons')"
        >
          Back
        </button>
      </div>
    </form>
  </div>

  <div class="prose w-full max-w-2xl h-9 flex flex-col" v-else>
    <h2>Registration Form</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <button
          type="submit"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-1 my-1"
        >
          Register
        </button>
        <button
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-1 my-1"
          @click="changeLogin('buttons')"
        >
          Back
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const course = await useCourse();
const { query } = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

let loginButtons = ref(true);
let loginForm = ref(false);
let email = ref("");
let password = ref("");

watchEffect(async () => {
  if (user.value) {
    await navigateTo(query.redirectTo as string, {
      replace: true,
    });
  }
});

const login = async () => {
  const redirectTo = `${window.location.origin}${query.redirectTo}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
  console.log("REDIRECT", redirectTo);
  if (error) {
    console.error(error);
  } else {
    console.log(supabase);
    console.log(supabase.auth);
    const user = useSupabaseUser();
    console.log("USER!!!!", user.value);
  }
};

const loginEmail = async () => {
  const redirectTo = `${window.location.origin}${query.redirectTo}`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test@apx.qa",
    password: "Test123!",
  });
  console.log("DATA", data);
  console.log("ERROR", error);
  window.location.replace(redirectTo);
};

const registerUser = async () => {
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error("Registration error:", error.message);
    } else {
      // Registration successful
      console.log("Registration successful");
      changeLogin("login");
      resetEntries();
      await navigateTo("/login");
    }
  } catch (error) {
    console.error(error);
  }
};

const changeLogin = (type: string) => {
  if (type === "buttons") {
    loginButtons.value = true;
    loginForm.value = false;
  } else if (type === "login") {
    loginButtons.value = false;
    loginForm.value = true;
  } else if (type === "register") {
    loginButtons.value = false;
    loginForm.value = false;
  }
  resetEntries();
};

const resetEntries = () => {
  email.value = "";
  password.value = "";
};
</script>
