import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import LogIn from './pages/login/LogIn';
import Home from './pages/home/Home';
import WaitingRoom from './pages/game/WaitingRoom';

const socket = io.connect("http://localhost:8000");

function App() {

  const [username, setUsername] = useState('')

  useEffect(() => {
    const getId = async () => {
      await socket.emit("get_socket_id");
    
      await socket.on('receive_socket_id', (data) => {
        setUsername('Anonymous-' + data)
      })
    }

    getId();
  }, [socket])

  return (
    <>
      <Routes>

        <Route path='/' element={<LogIn setUsername={setUsername} socket={socket} username={username} />} />
        <Route path='/home' element={<Home socket={socket} />} />
        <Route path='/:roomId/waiting' element={<WaitingRoom socket={socket} username={username} />} />
      </Routes>
    </>
  );
}

export default App;
