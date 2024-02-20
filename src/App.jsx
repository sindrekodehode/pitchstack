import { useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './src/Header/Header'
import { Dropbox } from './src/Dropbox/Dropbox'
import { Stats } from './src/Stats/Stats'
import { Res } from './src/Res/Res'
import axios from 'axios';



function App() {

  return (
    <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element= {<Dropbox />}/>
            <Route path="res" element= {<Res />}/>
            <Route path="stats" element= {<Stats />}/>
            <Route path="*" element= {<h1>404 Not Found</h1>}/>
          </Routes>
        </div>
    </Router>
  )
}

export default App
