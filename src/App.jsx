import { useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Landing } from './src/Landing/Landing'
import { Signin } from './src/Landing/Signin'
import { Signup } from './src/Landing/Signup'
import { Header } from './src/Header/Header'
import { Dropbox } from './src/Dropbox/Dropbox'
import { Stats } from './src/Stats/Stats'
import { Res } from './src/Res/Res'
import { Footer } from './src/Footer/Footer'
import { FAQ } from './src/FAQ/FAQ'
import axios from 'axios';



function App() {

  return (
    <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element= {<Landing />}/>  
            <Route path="/signup" element= {<Signup />}/> 
            <Route path="/signin" element= {<Signin />}/> 
            <Route path="/dropbox" element= {<Dropbox />}/>
            <Route path="res" element= {<Res />}/>
            <Route path="stats" element= {<Stats />}/>
            <Route path="faq" element= {<FAQ />}/>
            <Route path="*" element= {<h1>404 Not Found</h1>}/>
          </Routes>
          <Footer />
        </div>
    </Router>
  )
}

export default App
