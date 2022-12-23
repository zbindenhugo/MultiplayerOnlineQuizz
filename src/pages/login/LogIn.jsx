import { Link } from "react-router-dom"

export default function LogIn({setUsername, socket, username}){

    const emitUsername = () => {
        socket.emit('set_username_socket', username);
    }

    return(
        <div className="text-center fixed top-1/2 -translate-y-1/2 w-full">
            <div className="text-7xl">
                Welcome to Train my Brain !
            </div>
            <div className="mt-24">
                
                <p className="mb-10 text-2xl">Enter new username : <input type="text" onChange={(e) => setUsername(e.target.value)} className="p-2 border border-slate-500 rounded-md mr-5" /></p>
                <Link to={"/home"} className="text-3xl p-2 transition-all duration-200 hover:tracking-widest hover:scale-110 border rounded-lg border-slate-400" onClick={emitUsername}> Let's Play ! </Link>
            </div>
        </div>
    )
}