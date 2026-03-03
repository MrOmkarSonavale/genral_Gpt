import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment';
import toast from 'react-hot-toast';

import { data } from 'react-router-dom';

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
    const { chat, axios, setSelectedChat, theme, setTheme, user, navigate, createNewChat, setChat, fetchUserChats, setToken, token } = useAppContext();

    const [search, setSearch] = useState('');

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        toast.success("Logged out successfully")
    };


    const deleteChat = async (e, chatId) => {
        try {
            e.stopPropagation();

            const confirm = window.confirm("are you sure want to delete this chat?");

            if (!confirm) return;

            const { data } = await axios.post('/api/chat/delete', { chatId }, { headers: { Authorization: token } });

            if (data.success) {
                setChat(prev => prev.filter(chat => chat._id !== chatId));
                await fetchUserChats();
                toast.success(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        };
    };

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609f]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
                alt=''
                className='w-full max-w-48' />

            <button className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer' onClick={createNewChat}>
                <span className='mr-2 text-xl'>+</span>New Chat

            </button>

            <div className='flex items-center gap-2 p-3 mt-4 border border-grey-400 dark:border-white/20 rounded-md'>
                <img src={assets.search_icon} className='w-4 not-dark:invert' alt='Search icon' />
                <input onChange={(e) => setSearch(e.target.value)} value={search} type='text' placeholder='Seach c onversations' className='text-xs placeholder:text-gray outline-none' />
            </div>

            {
                chat.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>
            }

            <div>
                {
                    chat.filter((c) => c.messages[0] ? c.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) :
                        c.name.toLowerCase().includes(search.toLowerCase())).map((c) => (
                            <div
                                onClick={() => {
                                    setSelectedChat(c); setIsMenuOpen(false);
                                    navigate('/');
                                }}
                                key={c._id} className='p-2 mt-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark-border-[#80609F]/15 rounded-md cursor-pointer flex justify-between  group'>
                                <div>
                                    <p className='truncate w-full'>
                                        {c.messages.length > 0 ? c.messages[0].content.slice(0, 30) : c.name}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{moment(c.updatedAt).fromNow()}</p>
                                </div>

                                <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert'
                                    onClick={e => toast.promise(deleteChat(e, c._id), {
                                        loading: "deleting..."
                                    })} />
                            </div>
                        ))
                }




            </div>


            {/* <div onClick={() => { setIsMenuOpen(false); navigate('/community'); }}
                className='flex items-center gap-2 p-3 mt-19 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'
            >
                <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt='photo-icon' />

                <div className='flex flex-col text-sm'>
                    <p>Community Images</p>
                </div>
            </div> */}

            <div className='mt-auto'>
                <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }}
                    className='flex items-center gap-2 p-3 mt-15 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'
                >
                    <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt='photo-icon' />

                    <div className='flex flex-col text-sm'>
                        <p>Credits : {user?.credits || 0}</p>
                        <p>Purchase credits to use gpt</p>
                    </div>
                </div>


                <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>

                    <div className='flex items-center gap-2 text-sm'>
                        <img src={assets.theme_icon} className='w-4 not-dark:invert' />
                        <p>Dark Mode</p>
                    </div>

                    {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={theme === "dark"}
                            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                        />

                        <div className="relative w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-colors">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></span>
                        </div>
                    </label> */}

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={theme === "dark"}
                            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                        />

                        <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-colors"></div>

                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                    </label>


                </div>




                <div
                    className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'
                >
                    <img src={assets.user_icon} className='w-4.5 rounded-full' alt='photo-icon' />
                    <p className='flex-1 text-sm dark:text-primary truncate'>{
                        user ? user.name : 'Login to your account'
                    }</p>

                    {
                        user && <img
                            onClick={logout} src={assets.logout_icon} className='h-5 cursor-pointer not-dark:invert group-hover:black' />
                    }
                </div>

                <img src={assets.close_icon} className='absolute top-3 right-3 w-5  h-5 cursor-pointer md:hidden not-dark:invert' onClick={() => setIsMenuOpen(false)} />
            </div >
        </div>

    )
}

export default Sidebar