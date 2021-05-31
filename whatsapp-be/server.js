import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'

// app config
const app = express()
const port = process.env.PORT || 9000

// middleware
app.use(express.json())

// db config
const connection_url =
    'mongodb+srv://admin:O0uKBXxgA9iTgH7G@cluster0.9xusl.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

// api routes
app.get('/', (req, res) => {
    res.status(200).send('Hello there')
})

app.get('/api/v1/messages/sync', (req, res) => {
    const dbMessage = req.body
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/api/v1/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`))
