<template>
    <div>
      <h2>Update Your Password</h2>
      <form @submit.prevent="updatePassword">
        <div>
          <label>Current Password</label>
          <input type="password" v-model="current_password" required />
        </div>
        <div>
          <label>New Password</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input type="password" v-model="password_confirmation" required />
        </div>
        <button type="submit">Update Password</button>
      </form>
      <div v-if="message" class="message">{{ message }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const current_password = ref('');
  const password = ref('');
  const password_confirmation = ref('');
  const message = ref('');
  const error = ref('');
  
  const updatePassword = async () => {
    try {
      const response = await axios.put('http://localhost:8000/api/password', {
        current_password: current_password.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
      });
      console.log(response.data);
      
      message.value = 'Password updated successfully!';
      error.value = '';
      // Clear form fields
      current_password.value = '';
      password.value = '';
      password_confirmation.value = '';
    } catch (errorResponse) {
      error.value = errorResponse.response.data.errors?.updatePassword[0] || 'An error occurred';
      message.value = '';
    }
  };
  </script>
  
  <style>
  /* Add styling as needed */
  .message {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  