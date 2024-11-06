<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="user">
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <div v-if="user && user.profile_picture_url">
        <img :src="user.profile_picture_url" alt="Profile Picture" width="150" height="150" />
      </div>

      <button @click="logout">Logout</button> <!-- Logout button -->


       <!-- Profile Picture Upload Section -->
       <div>
        <h2>Upload Profile Picture</h2>
        <form @submit.prevent="uploadProfilePicture">
          <div>
            <input type="file" @change="handleFileChange" accept="image/*" />
          </div>
          <button type="submit" :disabled="!profilePicture">Upload Picture</button>
        </form>
        <div v-if="uploadMessage" class="message">{{ uploadMessage }}</div>
        <div v-if="uploadError" class="error">{{ uploadError }}</div>
      </div>
      <!-- End of Profile Picture Upload -->



      <!-- Password Update Form -->
      <div>
        <h2>Update Password</h2>
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
      <!-- End of Password Update Form -->

    </div>
    <div v-else>
      <p>Loading user information...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { url } from '../data';
import { useRouter } from 'vue-router'; // Import the useRouter function

// Define user info and router
const user = ref(null);
const router = useRouter();


// Profile picture logic
const profilePicture = ref(null);
const uploadMessage = ref('');
const uploadError = ref('');

// Define password update state variables
const current_password = ref('');
const password = ref('');
const password_confirmation = ref('');
const message = ref('');
const error = ref('');

// Fetch user info on mount
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${url}user`);
    user.value = response.data.user; // Assuming the API returns user data in this format
    
    // Check if the user has a profile picture and construct the URL
    if (user.value.profile_picture) {
      // Make sure to use the right public path to display the image
      user.value.profile_picture_url = `http://localhost:8000/storage/profile_picture/${user.value.profile_picture}`;
    }
    
    console.log(response.data.user);
  } catch (error) {
    console.error('Error fetching user information:', error);
  }
};


// Logout function
const logout = async () => {
  try {
    await axios.post(`${url}logout`);
    user.value = null;
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Password update function
const updatePassword = async () => {
  try {
    const response = await axios.put(`${url}password`, {
      current_password: current_password.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    }, { withCredentials: true });

    // Check for a success status in the response and clear any error state
    if (response.status === 200) {
      message.value = 'Password updated successfully!';
      error.value = '';
    } else {
      // Handle unexpected non-200 responses without throwing
      error.value = 'Unexpected response from server.';
      console.error(response);
    }
  } catch (errorResponse) {
    // Refine the error handling to extract error details if available
    if (errorResponse.response && errorResponse.response.data.errors) {
      error.value = Object.values(errorResponse.response.data.errors).flat()[0];
    } else {
      error.value = 'An error occurred during the update.';
    }
    message.value = '';
    console.error('Error:', errorResponse);
  }
};



// Profile Picture Upload Handler
const handleFileChange = (event) => {
  profilePicture.value = event.target.files[0]; // Store the selected file
};

// Profile Picture Upload Function
const uploadProfilePicture = async () => {
  if (!profilePicture.value) {
    uploadError.value = 'No file selected!';
    return;
  }

  const formData = new FormData();
  formData.append('profile_picture', profilePicture.value);

  try {
    const response = await axios.post(`${url}uploadProfilePic`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      uploadMessage.value = 'Profile picture uploaded successfully!';
      uploadError.value = '';
      fetchUserInfo(); // Refresh user info to reflect updated profile picture
    } else {
      uploadError.value = 'Error uploading profile picture!';
    }
  } catch (error) {
    uploadError.value = 'An error occurred while uploading the picture.';
    uploadMessage.value = '';
    console.error('Upload Error:', error);
  }
};


// Fetch user information when the component is mounted
onMounted(() => {
  fetchUserInfo();
});
</script>

<style>
/* Add any styles you want for your dashboard */
.message {
  color: green;
}
.error {
  color: red;
}
</style>
