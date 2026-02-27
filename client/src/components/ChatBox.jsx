import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Message from './Message';
import { useAppContext } from '../context/AppContext';
import { useRef } from 'react';

function ChatBox() {
    const containerRef = useRef(null);
    const { selectedChat, theme } = useAppContext();

    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);


    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('text');
    const [isPublished, setIsPublished] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        if (selectedChat) {
            setMessage(selectedChat.messages);
        }
    }, [selectedChat]);


    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });

    return (
        <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
            <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>

                {
                    message.length === 0 && (
                        <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                            <img
                                src={theme === 'dark' ? assets.logo_full_dark : assets.logo_full}
                                className='w-full max-w-56 sm:max-w-68'
                                alt="logo"
                            />
                            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>
                                Ask me anything.
                            </p>
                        </div>
                    )
                }

                {
                    message.map((msg, i) => (
                        console.log(msg),
                        <Message key={i} message={msg} />
                    ))

                }

                {
                    loading && (
                        <div className='loader flex items-center gap-1.5'>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bgw-white animate-bounce'></div>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bgw-white animate-bounce'></div>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bgw-white animate-bounce'></div>
                        </div>
                    )
                }

            </div>

            {
                mode === 'image' && (
                    <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
                        <p className='text-sm'>Publish Genrated Image to Community</p>
                        <input type='checkbox' className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}></input>
                    </label>
                )
            }

            <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-3 mx-auto  flex gap-4 items-center'>
                <select className='text-sm pl-3 pr-2 outline-none' onChange={(e) => setMode(e.target.value)} value={mode}
                >
                    <option value='text' className='dark:bg-purple-900'>Text</option>
                    <option value='image' className='dark:bg-purple-900'>Image</option>
                </select>
                <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type='text' placeholder='Type your prompt here...' className='flex-1 w-full text-sm outline-none' required />
                <button>
                    <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt='' />
                </button>
            </form>
        </div >
    );
}

export default ChatBox;