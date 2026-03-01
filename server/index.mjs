import express from 'express'
import fs from 'fs'
const app = express()
app.use(express.json())

const DATA_FILE = new URL('./data.json', import.meta.url)

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {messages:[]}
  }
}

function writeData(data){
  fs.writeFileSync(DATA_FILE,JSON.stringify(data, null, 2))
}

app.get('/api/messages', (req, res) => {
  const data = readData()
  res.json(data.messages)
})

app.post('/api/messages', (req, res) => {
  const {text, author = 'Anonymous'} = req.body || {}
  if (!text || !text.trim()) {
    return res.status(400).json({error: 'Text is required'})
  }
  const data = readData()
  const msg = {
    id:String(Date.now()),
    text: text.trim(),
    author: (author || '').trim() || 'Anonymous',
    createdAt: Date.now()
  }
  data.messages.unshift(msg)
  writeData(data)
  res.status(201).json(msg)
})

app.get('/api/ping', (req, res) => {
  res.send('pong')
})

app.get('/api/time', (req, res) => {
  res.json({
    now: Date.now(),
    iso: new Date().toISOString(),
  })
})

app.delete('/api/messages/:id', (req, res) => {
  const {id} = req.params
  const data = readData()
  const before = data.messages.length
  data.messages = data.messages.filter(m => m.id !== id)
  if (data.messages.length === before) {
    return res.status(404).json({error: 'Message not found'})
  }
  writeData(data)
  res.json({ ok: true })
})

// 让服务器监听 3001 端口 
const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})