import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL


const AppContxt = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [chat, setChat] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loadingUser, setLoadingUser] = useState(true);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: token }
            });

            if (data.success) {
                setUser(data.user)
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoadingUser(false);
        }
    };
    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', {
                headers: { Authorization: token }
            });

            if (!data.success) {
                return toast.error(data.message);
            }

            setChat(data.chats);

            if (data.chats.length > 0) {
                setSelectedChat(data.chats[0]);
            } else {
                await createNewChat();
            }

        } catch (err) {
            toast.error(err.message);
        }
    };


    const createNewChat = async () => {
        try {
            if (!user) {
                return toast('Login to create new chat');
            }

            navigate('/');

            const { data } = await axios.get('/api/chat/create', {
                headers: { Authorization: token }
            });

            if (!data.success) {
                return toast.error(data.message);
            }

            // Fetch chats once after creating
            await fetchUserChats();

        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (token)
            fetchUser();
        else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        };


        localStorage.setItem('theme', theme);
    }, [theme])

    useEffect(() => {
        if (user) {
            fetchUserChats();
        } else {
            setChat([]);
            setSelectedChat(null);
        };
    }, [user]);


    const value = { navigate, user, setUser, chat, setChat, selectedChat, setSelectedChat, theme, setTheme, loadingUser, fetchUserChats, token, setToken, axios, createNewChat, fetchUser };


    return (
        <AppContxt.Provider value={value}>
            {children}
        </AppContxt.Provider>
    )
};

export const useAppContext = () => useContext(AppContxt);