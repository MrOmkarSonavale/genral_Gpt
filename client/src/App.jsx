import React, { useState } from "react";
import SideBar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Credit from './pages/Credits';
import Login from './pages/Login';
import { assets } from "./assets/assets";
import './assets/prism.css';
import Loading from "./pages/Loading";
import { Toaster } from 'react-hot-toast';
import { useAppContext } from "./context/AppContext";

const App = () => {

  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === '/loading' || loadingUser) {
    return <Loading />
  };

  return (
    <>
      <Toaster />
      {
        !isMenuOpen &&
        <img src={assets.menu_icon} className="absolute top-3 left-3 w-8 h-8 curson-pointer md-hidden not-dark:invert" onClick={() => setIsMenuOpen(true)} />
      }
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">

            <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes >
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credit />} />
            </Routes >
          </div>
        </div>
      ) :
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      }
    </>
  );
}

export default App;