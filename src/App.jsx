import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './src/Header/Header'
import { Dropbox } from './src/Dropbox/Dropbox'
import { Stats } from './src/Stats/Stats'
import { Res } from './src/Res/Res'
import axios from 'axios';
import { ContextProvider, refreshToken } from './src/Context/Context'


function App() {

  useEffect(() => {
    try {
      const loginState = checkLoginState()
      if (loginState && loginState.hasSubmitted) {
        setHasSubmitted(true);
        setUsername(loginState.username);
        setCanLogin(false);
      } else {
        setHasSubmitted(false);
        setCanLogin(true);
        setCanLogout(false);
      }
  } catch (err) {
    console.error('Error checking localstorage', err);
    setCanLogin(true);
    setCanLogout(false);
  }
  }, []);
  
  

  return (
    <Router>
      <ContextProvider>
        <div>
          <Header />
          <Routes>
            <Route path="/" element= {<Dropbox />}/>
            <Route path="res" element= {<Res />}/>
            <Route path="stats" element= {<Stats />}/>
            <Route path="*" element= {<h1>404 Not Found</h1>}/>
          </Routes>
        </div>
      </ContextProvider>
    </Router>
  )
}

export default App
