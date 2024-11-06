<template>
    <div>
      <h1>Reset Password</h1>
      <form @submit.prevent="sendResetLink">
        <input type="email" v-model="email" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      <div v-if="message">{{ message }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        message: '',
        error: '',
      };
    },
    methods: {
      async sendResetLink() {
        try {
          const response = await axios.post('http://localhost:8000/api/forgot-password', { email: this.email });
          this.message = response.data.status;
          this.error = '';
        } catch (error) {
          this.error = error.response.data.error;
          this.message = '';
        }
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  