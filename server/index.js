const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server chal raha hai',
    time: new Date().toLocaleString()
  });
});

app.get('/api/posts', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'posts.json');
    
    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'Posts file nahi mili'
      });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allPosts = JSON.parse(fileContent);
    
    const searchText = req.query.q;
    
    if (searchText) {
      const searchedPosts = allPosts.filter(post => {
        return post.title.toLowerCase().includes(searchText.toLowerCase()) ||
               post.excerpt.toLowerCase().includes(searchText.toLowerCase());
      });
      
      return res.json({
        message: 'Search results mil gaye',
        posts: searchedPosts
      });
    }
    
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

app.get('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'data', 'posts.json');
    
    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'Posts file nahi mili'
      });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allPosts = JSON.parse(fileContent);
    
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

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server shuru ho gaya: http://localhost:' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/api/health');
  console.log('Saare posts: http://localhost:' + PORT + '/api/posts');
});
