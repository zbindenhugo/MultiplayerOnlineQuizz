import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({socket}){


    const [roomId, setRoomId] = useState('');

    const navigate = useNavigate();

    const createRoomClick = () => {
        socket.emit('create_room');
    }

    const joinRoomClick = () => {
        navigate(`/${roomId}/waiting`);
    }

    useEffect(() => {;
        socket.on('generated_room', (roomId) => {
            navigate(`/${roomId}/waiting`);
        })
    }, [socket])
    

    return(
        <div className="fixed top-1/2 -translate-y-1/2 w-full text-center">
            <div>
                <div className="text-9xl">It's time to play !</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-20">
                <div>
                    <button onClick={createRoomClick} className='text-4xl p-5 bg-blue-200 rounded-xl transition-all duration-200 hover:scale-125 border border-slate-400'>
                        Create new room !
                    </button>
                </div>
                <div>
                    <input type='text' onChange={(e) => {setRoomId(e.target.value)}} className='p-2 border border-slate-500 rounded-md mr-5 text-4xl' />
                    <button onClick={joinRoomClick} className='text-4xl p-5 bg-blue-200 rounded-xl transition-all duration-200 border border-slate-400'>
                        Join existing room !
                    </button>
                </div>
            </div>

        </div>
    )
}