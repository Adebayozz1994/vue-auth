<template>
    <div>
      <h1>News Feed</h1>
      <div v-for="news in newsFeed" :key="news.id" class="news-post">
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
          <input v-model="commentText" placeholder="Add a comment" />
          <button @click="addComment(news.id)">Comment</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        newsFeed: [],
        commentText: ''
      };
    },
    methods: {
      fetchNews() {
        axios.get('http://localhost:8000/api/news').then(response => {
          this.newsFeed = response.data.map(news => ({
            ...news,
            user_liked: news.likes.some(like => like.user_id === this.userId)
          }));
        });
      },
      toggleLike(newsId) {
        axios.post(`http://localhost:8000/api/news/${newsId}/like`).then(response => {
          this.fetchNews();
        });
      },
      addComment(newsId) {
        axios.post(`http://localhost:8000/api/news/${newsId}/comment`, {
          comment: this.commentText
        }).then(response => {
          this.commentText = '';
          this.fetchNews();
        });
      }
    },
    mounted() {
      this.fetchNews();
    }
  };
  </script>
  