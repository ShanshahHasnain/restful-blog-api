// Pehle required cheezein import karo
const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');

// Express app banayo
const app = express();
const PORT = 5000; // Simple fixed port

// CORS allow karo taki frontend connect kar sake
app.use(cors());

// JSON data accept karne ke liye
app.use(express.json());

// Health check - server check karne ke liye
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server chal raha hai',
    time: new Date().toLocaleString()
  });
});

// Saare posts get karne ka function
app.get('/api/posts', (req, res) => {
  try {
    // Posts file ka path banaya
    const filePath = path.join(__dirname, 'data', 'posts.json');
    
    // File read kiya
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allPosts = JSON.parse(fileContent);
    
    // Search ka option agar query aayi hai
    const searchText = req.query.q;
    
    if (searchText) {
      // Search karo posts mein
      const searchedPosts = allPosts.filter(post => {
        return post.title.toLowerCase().includes(searchText.toLowerCase()) ||
               post.excerpt.toLowerCase().includes(searchText.toLowerCase());
      });
      
      return res.json({
        message: 'Search results mil gaye',
        posts: searchedPosts
      });
    }
    
    // Warna saare posts bhej do
    res.json({
      message: 'Saare posts mil gaye',
      posts: allPosts
    });
    
  } catch (error) {
    console.log('Error aaya:', error);
    res.status(500).json({
      error: 'Kuch problem hai server mein'
    });
  }
});

// Ek specific post dhundhne ka function
app.get('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'data', 'posts.json');
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allPosts = JSON.parse(fileContent);
    
    // ID se post dhundho
    const foundPost = allPosts.find(post => post.id === postId);
    
    if (!foundPost) {
      return res.status(404).json({
        error: 'Yeh post nahi mila'
      });
    }
    
    res.json({
      message: 'Post mil gaya',
      post: foundPost
    });
    
  } catch (error) {
    console.log('Error aaya:', error);
    res.status(500).json({
      error: 'Server problem'
    });
  }
});

// Server start karo
app.listen(PORT, () => {
  console.log('Server shuru ho gaya: http://localhost:' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/api/health');
  console.log('Saare posts: http://localhost:' + PORT + '/api/posts');
});