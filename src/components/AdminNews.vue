<template>
    <div>
        <h2>Post News</h2>
        <form @submit.prevent="postNews">
            <input type="text" v-model="title.value" placeholder="News Title" required />
            <textarea v-model="content.value" placeholder="News Content" required></textarea>
            <button type="submit">Post</button>
        </form>
        <p v-if="message.value">{{ message.value }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive references for form data and response message
const title = ref('');
const content = ref('');
const message = ref('');

// Function to post news
const postNews = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/admin/news', {
            title: title.value,
            content: content.value
        });
        message.value = response.data.message; // Store response message
        title.value = '';  // Clear the title input
        content.value = '';  // Clear the content input
    } catch (error) {
        console.error('Error posting news:', error);
    }
};
</script>
