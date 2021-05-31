import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'

// app config
const app = express()
const port = process.env.PORT || 9000

// middleware
app.use(express.json())
app.use(cors())

// db config
const connection_url =
    'mongodb+srv://admin:O0uKBXxgA9iTgH7G@cluster0.9xusl.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

const pusher = new Pusher({
    appId: '1212492',
    key: '54b74feac9994bc70597',
    secret: 'ec9725c41203d1d034f7',
    cluster: 'ap1',
    useTLS: true,
})

// api routes
const db = mongoose.connection
db.once('open', () => {
    console.log('DB is connected')
    const messageCollection = db.collection('messagecontents')
    const changeStream = messageCollection.watch()

    changeStream.on('change', (change) => {
        console.log('new message is', change)

        if (change.operationType === 'insert') {
            const messageDetail = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetail.name,
                message: messageDetail.message,
                timestamp: messageDetail.timestamp,
                received: messageDetail.received,
            })
        } else {
            // console.log()
        }
    })
})

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
