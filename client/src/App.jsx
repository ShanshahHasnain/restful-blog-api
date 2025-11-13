import { useState, useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Server se posts fetch karo
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

  // Component load hote hi posts fetch karo
  useEffect(() => {
    fetchPosts()
  }, [])

  // Search karne ka function
  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts()
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '2.5rem' }}>Mera Blog</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '12px', width: '300px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </header>

      <main>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', padding: '40px' }}>Loading posts...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
            {posts.map(post => (
              <div key={post.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '25px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1.4rem', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>
                  {post.title}
                </h2>
                <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '15px' }}>{post.excerpt}</p>
                <div style={{ color: '#34495e', lineHeight: '1.6', marginBottom: '15px' }}>{post.content}</div>
                <div style={{ color: '#95a5a6', fontSize: '0.8rem', textAlign: 'right' }}>Post ID: {post.id}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App