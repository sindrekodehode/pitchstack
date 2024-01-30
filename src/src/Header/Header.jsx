import styles from './header.module.css'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { AppContext, ContextProvider, refreshToken } from '../Context/Context';
import { setLoginState, checkLoginState, setLogout } from '../Context/Context';

export function Header() {

  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {hasSubmitted, setHasSubmitted, canLogin, setCanLogin, canLogout, setCanLogout} = useContext(AppContext);

  const userData = { user: username, pwd: password }


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
  

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    const config = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true,
    }
    
    console.log('Form submitted with data:', userData)

    if (action === 'login') {
      try {
        const response =  await axios.post('https://2012-20-223-156-203.ngrok-free.app/auth', JSON.stringify(userData), config);
        console.log('Logged in successfully', response.data);
        setTimeout(async () => {
        try {
          await refreshToken()
          setIsLogin(false);
          setCanLogin(false);
          setLoginState(username);
          setHasSubmitted(true);
        } catch (error) {
          console.error('Error requesting refreshtoken:', error);
        }
      }, 100)
      } catch (error) {
        console.error('Error posting data:', error.response ? error.response.data : error.message);
      }
    } else if (action === 'register') {
      try {
        const response =  await axios.post('https://2012-20-223-156-203.ngrok-free.app/register', JSON.stringify(userData), config);
      } catch (error) {
        console.error('Error posting data:', error);
      }
      try {
        const response =  await axios.post('https://2012-20-223-156-203.ngrok-free.app/auth', JSON.stringify(userData), config);
        console.log('Logged in successfully', response.data);
        setTimeout(async () => {
        try {
          await refreshToken()
          setIsLogin(false);
          setCanLogin(false);
          setLoginState(username);
          setHasSubmitted(true);
        } catch (error) {
          console.error('Error requesting refreshtoken:', error);
        }
      }, 200)
      } catch (error) {
        console.error('Error posting data:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleLogout = async (e, action) => {
    e.preventDefault();
    const config = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true,
    }
    try {
      const response =  await axios.post('https://2012-20-223-156-203.ngrok-free.app/logout', JSON.stringify(userData), config);
      console.log('Logged out successfully', response.data);
      setLogout();
      setIsLogin(false);
      setHasSubmitted(false);
      setCanLogout(false);
      setCanLogin(true);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }
  
  return (
    <>
    <div className={styles.header}>
      <img src='/stacklogo.svg' className={styles.logo}></img>
      <div className={styles.navContainer}>
        <ul className={styles.list}>
            <li><Link to="/">Dropbox</Link></li>
            <li><Link to="/stats">Stats</Link></li>
            {canLogin && (<li><button onClick={() => setIsLogin(!isLogin)}>Login</button></li>)}
            {isLogin && (
              <div className={styles.login}>
                  <form>
                    <label>Username:
                      <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" maxLength="10" required/>
                    </label>
                    <label>Password:
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" maxLength="10" required/>
                    </label>
                    <div className={styles.btnContainer}>
                      <button type='submit' onClick={(e) => handleSubmit(e, 'login')}>Login</button>
                      <button type='submit'onClick={(e) => handleSubmit(e, 'register')}>Register</button>
                    </div>
                  </form>
              </div>
      )}
        {hasSubmitted && (
          <li>
            <div className={styles.profile}>
              <img src='/profile.svg' onClick={() => setCanLogout(!canLogout)} className={styles.profileimg}></img>
              <p>{username}</p>
            </div>
          </li>
        )}
      {canLogout && (
              <div className={styles.login}>
                  <form>
                    <h3>Username: {username}</h3>
                    <div className={styles.btnContainer}>
                      <button type='submit' onClick={(e) => handleLogout(e, 'logout')}>Logout</button>
                    </div>
                  </form>
              </div>
      )}
        </ul>
      </div>
    </div> 
    
    
    </>
  )
}
