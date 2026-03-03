import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // New state to track which post is being edited
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const res = await axios.get('https://blog-mern-7h6l.onrender.com/api/posts')
    setPosts(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !content) return alert("Fill in the fields!")
    await axios.post('https://blog-mern-7h6l.onrender.com/api/posts', { title, content })
    setTitle(''); setContent(''); fetchPosts()
  }

  const deletePost = async (id) => {
    if (window.confirm("Delete this post?")) {
      await axios.delete(`https://blog-mern-7h6l.onrender.com/api/posts/${id}`)
      fetchPosts()
    }
  }

  // --- NEW: START EDITING ---
  const startEdit = (post) => {
    setEditingId(post._id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  // --- NEW: SAVE UPDATE ---
  const handleUpdate = async (id) => {
    await axios.put(`https://blog-mern-7h6l.onrender.com/api/posts/${id}`, { title: editTitle, content: editContent })
    setEditingId(null)
    fetchPosts()
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto bg-gray-100">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-blue-700 uppercase tracking-widest">My Blog</h1>
        <div className="h-1 w-20 bg-yellow-400 mx-auto mt-2"></div>
      </header>

      {/* Create Post Section */}
      <section className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-400 mb-10">
        <h3 className="text-lg font-bold text-gray-700 mb-4">New Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-gray-50 border border-gray-300 rounded p-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full bg-gray-50 border border-gray-300 rounded p-3 h-24" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded shadow transition-all">PUBLISH POST</button>
        </form>
      </section>

      {/* Feed Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-800 italic">Latest Updates</h2>
        {posts.slice().reverse().map((post) => (
          <div key={post._id} className="bg-white p-5 rounded border border-gray-200 shadow-sm relative group">

            {editingId === post._id ? (
              // EDIT MODE UI
              <div className="space-y-2">
                <input className="w-full border p-2 rounded" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <textarea className="w-full border p-2 rounded" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(post._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              // VIEW MODE UI
              <>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => startEdit(post)} className="text-blue-400 hover:text-blue-600 font-bold text-xs uppercase">Edit</button>
                  <button onClick={() => deletePost(post._id)} className="text-gray-300 hover:text-red-600 font-bold text-xs uppercase">Remove</button>
                </div>
                <h2 className="text-xl font-bold text-blue-600 mb-2">{post.title}</h2>
                <p className="text-gray-700 leading-snug">{post.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App