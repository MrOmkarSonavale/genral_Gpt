import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData } from "../assets/assets";
import { dummyChats } from "../assets/assets";
import { useState, useEffect } from "react";

const AppContxt = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [chat, setChat] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


    const fetchUser = async () => {
        setUser(dummyUserData)
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const value = { navigate, user, setUser, chat, setChat, selectedChat, setSelectedChat, theme, setTheme };

    const fetchUserChats = async () => {
        setChat(dummyChats);
        setSelectedChat(dummyChats[0]);
    }


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


    return (
        <AppContxt.Provider value={value}>
            {children}
        </AppContxt.Provider>
    )
};

export const useAppContext = () => useContext(AppContxt);