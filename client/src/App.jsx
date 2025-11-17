import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const API_BASE_URL = 'https://restful-blog-api-p2yo.onrender.com'

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = search 
        ? `${API_BASE_URL}/api/posts?q=${search}`
        : `${API_BASE_URL}/api/posts`
      
      console.log('Fetching from:', url) // Debug ke liye
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.posts) {
        setPosts(data.posts)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.log('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts()
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Mera Blog</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-content">{post.content}</div>
                <div className="post-id">Post ID: {post.id}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            No posts found. 
            <br />
            <button onClick={fetchPosts} style={{marginTop: '10px', padding: '8px 16px'}}>
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
