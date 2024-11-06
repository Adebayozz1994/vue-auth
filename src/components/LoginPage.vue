<template>
    <h1>Login works</h1>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <div v-if="error">{{ error }}</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { url } from '../data';
  import { useRouter } from 'vue-router'; // Import the useRouter function
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter(); // Initialize the router instance
  
  const getCsrfToken = async () => {
    try {
      await axios.get(`${url}sanctum/csrf-cookie`);
    } catch (error) {
      console.error('Error fetching CSRF cookie:', error);
    }
  };
  
  const login = async () => {
    try {
      const response = await axios.post(`${url}login`, {
        email: email.value,
        password: password.value,
      });
      console.log('Login response:', response.data);
      
      if (response.data.status) {
        // Navigate to the dashboard upon successful login
        router.push('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        error.value = error.response.data.message || 'Login failed';
      } else {
        error.value = 'An error occurred';
      }
    }
  };
  
  // Call the function to fetch CSRF token
  getCsrfToken();
  </script>
  
  <style>
  /* Add styles as needed */
  </style>
  