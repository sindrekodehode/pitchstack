import { useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './src/Header/Header'
import { Dropbox } from './src/Dropbox/Dropbox'
import { Stats } from './src/Stats/Stats'
import { Res } from './src/Res/Res'
import axios from 'axios';
import { ContextProvider, refreshToken } from './src/Context/Context'



function App() {

  useEffect( async ()  => {
    const itemStr = JSON.parse(localStorage.getItem("loginState"));

    if (!itemStr) {
        return { hasSubmitted: false };
    }

    if (itemStr.hasSubmitted === true) {

      try {
          const config = {
              headers: {
                  'Content-Type': 'application/json'
              },
              withCredentials: true,
          };
         return await axios.post('https://aivispitchstackserver.azurewebsites.net/auth', JSON.stringify(item), config);
      } catch (error) {
          console.error("Error fetching cookie:", error);
      }
    }
})


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
