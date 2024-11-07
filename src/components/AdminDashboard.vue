<template>
    <div class="dashboard">
      <h4>Dashboard</h4>
  
      <!-- Displaying the User's Name and Email -->
      <div class="user-info">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
  
      <!-- Update Password Button -->
      <button @click="showUpdatePasswordForm = !showUpdatePasswordForm" 
              class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        Update Password
      </button>
  
      <!-- Display Update Password Form if the user clicked the button -->
      <div v-if="showUpdatePasswordForm">
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
  
      <!-- Logout Button -->
      <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
        Logout
      </button>
      <button @click="register" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
        Register
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router';
  import axios from 'axios';
// import { url } from '@/data';
  
  const user = ref({ name: '', email: '' });
  const router = useRouter();
  
  // States for password update form
  const current_password = ref('');
  const password = ref('');
  const password_confirmation = ref('');
  const message = ref('');
  const error = ref('');
  const showUpdatePasswordForm = ref(false); // Toggle for showing the update password form
  
  // Fetch user info
  const fetchUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:8000/api/admin/getAdmin', { token })
        .then(res => {
          if (res.data.status) {
            user.value.name = res.data.admin.name;
            user.value.email = res.data.admin.email;
          } else {
            console.error('Failed to fetch user info');
          }
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    } else {
      // If there's no token, redirect to login page
      router.push('/admin/login');
    }
  };
  
  // Call fetchUserInfo when the component is mounted
  onMounted(fetchUserInfo);
  
  // Logout function
  const logout = () => {
    const token = localStorage['token'];
    axios.post('http://localhost:8000/api/admin/logout', { token }).then(() => {
      localStorage.removeItem('token');
      router.push('/admin/login');
    });
  };
  
  // Register function
  const register = () => {
    router.push('/admin/register');
  };
  
  // Update password function
  const updatePassword = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.put('http://localhost:8000/api/admin/password', {
        current_password: current_password.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token with the request
        },
      });
      console.log(response);
      
  
      message.value = 'Password updated successfully!';
      error.value = '';
      // Clear form fields
      current_password.value = '';
      password.value = '';
      password_confirmation.value = '';
    } catch (errorResponse) {
      // Handle errors more precisely by field names
      if (errorResponse.response && errorResponse.response.data.errors) {
        const errors = errorResponse.response.data.errors;
        error.value = errors.current_password?.[0] || errors.password?.[0] || errors.password_confirmation?.[0] || 'An error occurred';
      } else {
        error.value = 'An error occurred';
      }
      message.value = '';
    }
  };
  </script>
  
  <style scoped>
  /* Add styling as needed */
  .message {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  