<template>
    <div class="dashboard">
        <h4>Dashboard</h4>

        <!-- Displaying the User's Name and Email -->
        <div class="user-info">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
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

const user = ref({ name: '', email: '' });
const router = useRouter();

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

const logout = () => {
    const token = localStorage['token'];
         axios.post('http://localhost:8000/api/admin/logout', {token}).then(() => {
                 localStorage.removeItem('token')
            router.push('/admin/login');
         })
};
const register = () => {
    router.push('/admin/register');
}
</script>

<style scoped>
/* Add any custom styling here */
</style>
