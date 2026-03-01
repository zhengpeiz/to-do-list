import { use, useEffect, useState } from 'react'
import ThemeToggle from './components/ThemeToggle.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(7)
  const [pong, setPong] = useState('(no request yet)')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('') 
  const [time, setTime] = useState(null)
  const [timeErr, setTimeErr] = useState('') 
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [list, setList] = useState([])
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  // When theme changes, update the data attribute and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme 
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setList(data)
    } catch (e) {
      setErr(e.message)
    }
  } 

  async function submitMessage(e) {
    e.preventDefault()
    setErr('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({author, text})
      }) 
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const created = await res.json()
      setList(prev => [created, ...prev])
      setText('')
    } catch (e) {
      setErr(e.message)
    }
  }

  async function fetchTime() {
    setTimeErr('')
    try {
      const res = await fetch('/api/time')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTime(data)
    } catch (e) {
      setTimeErr(e.message)
    }
  }

  async function testPing() {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/ping')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      setPong(text)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id) {
    try {
      const res = await fetch(`/api/messages/${id}`, {method:'DELETE'})
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setList(prev => prev.filter(m => m.id !== id))
    } catch (e) {
      setErr(e.message)
    }
  }


  return (
    <>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin:0}}>To Do List</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <form onSubmit={submitMessage} style={{display:'grid', gap:8, margin:'16px 0'}}>
        <input className='messagebox'
          placeholder="Your name (optional)"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea className='messagebox'
          placeholder="Your task"
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div style={{display:'flex', gap:8}}>
          <button type="submit">Add to List</button>
        </div>
      </form> 

      

      <ul style={{listStyle:'none', padding:0, display:'grid', gap:10, marginTop:16}}>
        {list.map(m => (
          <li class='messagebox' key={m.id} style={{padding:12, borderRadius:8}}>
            <div style={{fontSize:12}}>
              <span><b>{m.author || 'anonymous'}</b> · {new Date(m.createdAt).toLocaleString()}</span>
              <button onClick={() => onDelete(m.id)} style={{marginLeft:16, fontSize:12}}>delete</button>
            </div>
            <div style={{marginTop:8, whiteSpace:'pre-wrap'}}>{m.text}</div>
          </li>
        ))}
      </ul>


      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:16}}>
        <button onClick={fetchTime}>request /api/time</button>
        <span>
          {time ? (
            <>
              <b>{new Date(time.now).toLocaleString()}</b>
              <small style={{marginLeft:8, color:'#6b7280'}}>(ISO: {time.iso})</small>
            </>
          ) : 'No time fetched yet.'}
        </span>
        {timeErr && <span style={{color:'#b91c1c'}}>Error：{timeErr}</span>}
      </div>
      <div style={{maxWidth: 720, margin: '40px auto', padding:'0 16px', fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,PingFang SC,Noto Sans,sans-serif'}}>
       <h1>front-end back-end connection test</h1>
       
       <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:16}}></div>
        <button onClick={testPing} disabled={loading}>
          {loading ? 'requesting...' : 'request /api/ping'}
        </button>
        <span>return: <b>{pong}</b></span>
        {err && <span style={{color:'#b91c1c'}}>Error：{err}</span>}
      </div>

      
      
     
    </>
  )
}

export default App
