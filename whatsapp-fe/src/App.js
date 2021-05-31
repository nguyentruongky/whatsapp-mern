import './App.css'
import Sidebar from './Sidebar'
import Chat from './Chat'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import axios from './axios'

function App() {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        axios.get('api/v1/messages/sync').then((response) => {
            console.log(response.data)
            setMessages(response.data)
        })
    }, [])
    useEffect(() => {
        Pusher.logToConsole = true

        var pusher = new Pusher('54b74feac9994bc70597', {
            cluster: 'ap1',
        })

        var channel = pusher.subscribe('messages')
        channel.bind('inserted', function (newMessage) {
            setMessages([...messages, newMessage])
            console.log(messages)
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [messages])
    return (
        <div className="app">
            <div className="app__body">
                <Sidebar />
                <Chat messages={messages} />
            </div>
        </div>
    )
}

export default App
