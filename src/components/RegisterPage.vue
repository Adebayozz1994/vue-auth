<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="registerUser">
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
        
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
  
        <div>
          <label for="password_confirmation">Confirm Password</label>
          <input type="password" id="password_confirmation" v-model="form.password_confirmation" required />
        </div>
  
        <button type="submit" :disabled="loading">Register</button>
  
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success">{{ successMessage }}</div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
import { url } from '@/data';
  
  const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  const loading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const router = useRouter();
  
  // Function to get the CSRF token
  const getCsrfToken = async () => {
    try {
      // Make a GET request to set the CSRF cookie
      await axios.get(`${url}sanctum/csrf-cookie`);
    } catch (error) {
      console.error('Error fetching CSRF cookie:', error);
    }
  };
  
  // Call the CSRF token method when the component is mounted
  onMounted(() => {
    getCsrfToken();
  });
  
  const registerUser = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    try {
      // Send the registration request
      const response = await axios.post(`${url}register`, form.value, {
        withCredentials: true, // Ensure cookies are sent for session
      });
      console.log(response.data);
      
      successMessage.value = 'Registration successful! Redirecting...';
      setTimeout(() => {
        router.push('/login'); // Redirect to the dashboard or any other page after registration
      }, 2000);
    } catch (error) {
      errorMessage.value = 'Error: ' + (error.response?.data?.message || 'Something went wrong');
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  