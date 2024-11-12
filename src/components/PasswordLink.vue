<template>
  <div>
    <h1>Reset Password</h1>
    <form @submit.prevent="sendPasswordResetLink">
      <input type="email" v-model="email" placeholder="Enter your email" required />
      <button type="submit">Send Reset Link</button>
    </form>
    <div v-if="message">{{ message }}</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const email = ref('');
    const message = ref('');
    const error = ref('');

    const sendPasswordResetLink = async () => {
      try {
        // Get CSRF cookie first
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');

        const response = await axios.post('http://localhost:8000/api/forgot-password', { email: email.value });
        console.log(response.data); // Log the response
        if (response.data.message) {
          message.value = response.data.message; // Success message
          error.value = '';
        } else if (response.data.error) {
          error.value = response.data.error; // Error message
          message.value = '';
        }
      } catch (err) {
        console.error(err.response?.data || err); // Log the error response
        error.value = err.response?.data?.error || 'An error occurred';
        message.value = '';
      }
    };

    return {
      email,
      message,
      error,
      sendPasswordResetLink
    };
  },
};
</script>

<style>
/* Add your styles here */
</style>
