import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state() {
    return {
      newsFeed: JSON.parse(localStorage.getItem('newsFeed')) || [],
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    };
  },
  mutations: {
    setNewsFeed(state, newsFeed) {
      state.newsFeed = newsFeed;
      localStorage.setItem('newsFeed', JSON.stringify(JSON.parse(JSON.stringify(state.newsFeed))));
    },

    addComment(state, { newsId, comment }) {
      const newsPost = state.newsFeed.find(news => news.id === newsId);
      if (newsPost) {
        newsPost.comments.push(comment);
        localStorage.setItem('newsFeed', JSON.stringify(JSON.parse(JSON.stringify(state.newsFeed))));
      }
    },

    updateLikeStatus(state, { newsId, likes, user_liked }) {
      const newsPost = state.newsFeed.find(news => news.id === newsId);
      if (newsPost) {
        newsPost.likes = likes;
        newsPost.user_liked = user_liked;
        localStorage.setItem('newsFeed', JSON.stringify(state.newsFeed));
      }
    },

    setCurrentUser(state, user) {
      state.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    removeNews(state, newsId) {
      state.newsFeed = state.newsFeed.filter(news => news.id !== newsId);
      localStorage.setItem('newsFeed', JSON.stringify(state.newsFeed));
    },
  },
  actions: {
    async fetchNews({ commit }) {
      try {
        const response = await axios.get('http://localhost:8000/api/news');
        commit('setNewsFeed', response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    },

    async toggleLike({ commit }, newsId) {
      try {
        const response = await axios.post(`http://localhost:8000/api/news/${newsId}/like`);
        commit('updateLikeStatus', { 
          newsId, 
          likes: response.data.likes, 
          user_liked: response.data.user_liked 
        });
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },

    async addComment({ commit }, { newsId, commentText }) {
      try {
        const response = await axios.post(`http://localhost:8000/api/news/${newsId}/comment`, {
          comment: commentText
        });

        const newComment = {
          ...response.data.comment,
          user_name: response.data.user_name,
        };

        commit('addComment', { newsId, comment: newComment });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },

    async deleteNews({ commit }, newsId) {
      try {
        await axios.delete(`http://localhost:8000/api/news/${newsId}`);
        commit('removeNews', newsId);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    },

    setCurrentUser({ commit }, user) {
      commit('setCurrentUser', user);
    },
  },
  getters: {
    currentUser(state) {
      return state.currentUser;
    },

    commentsForNews: (state) => (newsId) => {
      const newsPost = state.newsFeed.find(news => news.id === newsId);
      return newsPost ? newsPost.comments : [];
    }
  }
});

export default store;
