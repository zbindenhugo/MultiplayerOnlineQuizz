import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function WaitingRoom({socket, username}){

    //Joueurs
    const [players, setPlayers] = useState([])
    //Savoir si le joueur est l'admin de la room

    const [isAdmin, setIsAdmin] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [chosenCategorie, setChosenCategorie] = useState('');
    const [nbQuestions, setNbQuestions] = useState(10)
    const [difficulty, setDifficulty] = useState('')

    const {roomId} = useParams();

    const setCategoriesOptions = () => {
        var allSelect = [];
        for(const cat in allCategories){
            allSelect.push(<option value={allCategories[cat][allCategories[cat].length - 1]} key={cat}>{cat}</option>)
        }

        return allSelect;
    }

    const startGameClick = async () => {
        socket.emit('begin_game', {
            nbQuestions: nbQuestions,
            categorie: chosenCategorie,
            difficulty: difficulty,
            roomId: roomId
        });
    }

    useEffect(() => {
        socket.emit('joined_room', roomId);

        socket.on('receive_all_players', async (players) => {
            await setPlayers(players);
        })

        socket.emit('is_admin');

        socket.on('is_admin_answered', (isAdmin) => {
            setIsAdmin(isAdmin);
        })

        socket.emit('get_all_categories');

        socket.on('receive_all_categories', async (categories) => {
            await setAllCategories(categories);
        })

        setCategoriesOptions();

    }, [socket])
    

    return(
        <div>

            <div className="sidebar w-[500px] bg-[#2e2f3e] text-[#fffffe] h-[100vh] fixed z-10 top-0 left-0 overflow-x-hidden p-5">
                <div className="text-center text-3xl italic mb-2">Players in the room</div>
                <hr />
                <div className="text-center text-xl">
                    {
                        players.map((p) => {
                            return(
                                <p key={p.id}>
                                    {
                                        username === p.username ?
                                            p.username + ' (YOU)'
                                        :
                                            p.username

                                    }
                                </p>
                            )
                        })
                    }
                </div>
                {
                    isAdmin ? 
                        <div className="fixed bottom-20 w-[450px]">

                            <div className="text-center text-3xl italic mb-2">Customize options</div>
                            <hr />
                            <div className="text-center mt-5">
                                <div className="text-xl">
                                    <p>Number of questions ({nbQuestions})</p>
                                    <input type='range' min={1} max={50} value={nbQuestions} onChange={(e) => {setNbQuestions(e.target.value)}} />
                                </div>

                                <div className="mt-5 text-xl">
                                    <p>Select a categorie</p>
                                    <select className='rounded-full p-1 md:text-xl text-md text-black' value={chosenCategorie} onChange={(e) => {setChosenCategorie(e.target.value)}}>
                                        <option>== All categories ==</option>
                                        {
                                            setCategoriesOptions()
                                        }
                                    </select>
                                </div>
                                <div className="mt-5 text-xl">
                                    <p>Select a difficulty</p>
                                    <select className='rounded-full p-1 md:text-xl text-md text-black' value={difficulty} onChange={(e) => {setDifficulty(e.target.value)}}>
                                        <option className='rounded-full p-1 md:text-xl text-md' value={''}>== All difficulties ==</option>
                                        <option className='rounded-full p-1 md:text-xl text-md' value={'easy'}>Easy</option>
                                        <option className='rounded-full p-1 md:text-xl text-md' value={'medium'}>Medium</option>
                                        <option className='rounded-full p-1 md:text-xl text-md' value={'hard'}>Hard</option>
                                        
                                    </select>
                                </div>
                                <div className="mt-5 text-xl">
                                    <button onClick={startGameClick}>Start the game !</button>
                                </div>
                            </div>
                        </div>
                    :
                    null
                }
                
            </div>
            <div className="main-content ml-[500px]">
                {
                    !isAdmin ? 
                        <div>
                            Waiting for the admin to launch the game !
                        </div>
                    :
                        <div>
                            Finish the settings then launch the game ! 
                        </div>
                }
            </div>

        </div>
    )
}