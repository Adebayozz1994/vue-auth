<template>
    <div>
        <h1>News Feed</h1>
        <div v-for="news in newsFeed.value" :key="news.id" class="news-post">
            <h2>{{ news.title }}</h2>
            <p>{{ news.content }}</p>
            <p><strong>Author:</strong> {{ news.author }}</p>
            <button @click="toggleLike(news.id)">
                {{ news.user_liked ? 'Unlike' : 'Like' }} ({{ news.likes.length }})
            </button>
            
            <!-- Comments Section -->
            <div>
                <h3>Comments</h3>
                <div v-for="comment in news.comments" :key="comment.id" class="comment">
                    <p>{{ comment.comment }}</p>
                </div>
                <input v-model="commentText.value" placeholder="Add a comment" />
                <button @click="addComment(news.id)">Comment</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive references for news feed and comment text
const newsFeed = ref([]);
const commentText = ref('');
const userId = ref(1); // replace with actual user ID, or fetch dynamically if needed

// Fetch news from API
const fetchNews = async () => {
    const response = await axios.get('http://localhost:8000/api/news');
    newsFeed.value = response.data.map(news => ({
        ...news,
        user_liked: news.likes.some(like => like.user_id === userId.value)
    }));
};

// Toggle like status for a news post
const toggleLike = async (newsId) => {
    try {
        await axios.post(`http://localhost:8000/api/news/${newsId}/like`);
        await fetchNews(); // Refresh the news feed after like/unlike
    } catch (error) {
        console.error('Error toggling like:', error);
    }
};

// Add comment to a news post
const addComment = async (newsId) => {
    try {
        await axios.post(`http://localhost:8000/api/news/${newsId}/comment`, {
            comment: commentText.value
        });
        commentText.value = ''; // Clear input after commenting
        await fetchNews(); // Refresh the news feed after adding comment
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};

// Fetch news when component is mounted
onMounted(fetchNews);
</script>
