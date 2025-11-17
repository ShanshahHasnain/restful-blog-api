import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = search 
        ? `http://localhost:5000/api/posts?q=${search}`
        : 'http://localhost:5000/api/posts'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.log('Error:', error)
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
          <div className="no-posts">No posts found or server connection issue.</div>
        )}
      </main>
    </div>
  )
}

export default App
