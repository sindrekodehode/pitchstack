import styles from './header.module.css'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { AppContext, ContextProvider, refreshToken } from '../Context/Context';
import { doSignOut } from '../../../firebase/auth';
import { useAuth, getUser } from '../Context/authContext';

export function Header() {
  const { canLogout, setCanLogout, username, setUsername} = useContext(AppContext);
  const { currentUser, userLoggedIn } = useAuth();
  
  useEffect(() => {
      if (currentUser) {
        const user = getUser();
        setUsername(user.displayName)
      }
    }, []);

  const navigate = useNavigate();

  const navigateHome = () =>  {
    navigate('/');
  }

  const onLogout = () => {
    doSignOut().then(() => { navigate('/') });
  }
  
  return (
    <>
    <div className={styles.header}>
      <div className={styles.logo} onClick={navigateHome} >
        <img src='/crabiconlarge.svg' alt='crab pitchstack logo' className={styles.logo}></img>
        <h2>Pitchstack</h2>
      </div>
      <div className={styles.navContainer}>
        <ul className={styles.list}>
            <li><Link to="/">Dropbox</Link></li>
            <li><Link to="/stats">Stats</Link></li>
            <li><Link to="/faq">FAQ</Link></li>   
        {userLoggedIn && (
          <li>
            <div className={styles.profile}>
              <img src='/profile.svg' alt='profile picture' onClick={() => setCanLogout(!canLogout)} className={styles.profileimg}></img>
              <p>{username}</p>
            </div>
          </li>
        )}
      {canLogout && (
              <div className={styles.login}>
                  <form>
                    <h3>Username: {username}</h3>
                    <div className={styles.btnContainer}>
                      <button type='submit' onClick={() => onLogout()}>Logout</button>
                    </div>
                  </form>
              </div>
      )}
        </ul>
      </div>
    </div>
    <div className={styles.rainbowRoad}></div>
    
    
    </>
  )
}

  // useEffect(() => {
  //   try {
  //     const loginState = checkLoginState()
  //     if (loginState && loginState.hasSubmitted) {
  //       setHasSubmitted(true);
  //       setUsername(loginState.username);
  //       setCanLogin(false);
  //     } else {
  //       setHasSubmitted(false);
  //       setCanLogin(true);
  //       setCanLogout(false);
  //     }
  // } catch (err) {
  //   console.error('Error checking localstorage', err);
  //   setCanLogin(true);
  //   setCanLogout(false);
  // }
  // }, []);
  

  // const handleSubmit = async (e, action) => {

  //   if (!username.includes('@')) {
  //     alert('Email must contain an @ symbol.');
  //     return;
  //   }

  //   e.preventDefault();
  //   const config = {
  //     headers: {'Content-Type': 'application/json'},
  //     withCredentials: true,
  //   }
    
  //   console.log('Form submitted with data:', userData)

  //   if (action === 'login') {
  //     try {
  //       const response =  await axios.post('https://aivispitchstackserver.azurewebsites.net/auth', JSON.stringify(userData), config);
  //       console.log('Logged in successfully', response.data);
  //       setTimeout(async () => {
  //       try {
  //         await refreshToken()
  //         setIsLogin(false);
  //         setCanLogin(false);
  //         setLoginState(username);
  //         setHasSubmitted(true);
  //       } catch (error) {
  //         console.error('Error requesting refreshtoken:', error);
  //       }
  //     }, 100)
  //     } catch (error) {
  //       console.error('Error posting data:', error.response ? error.response.data : error.message);
  //     }
  //   } else if (action === 'register') {
  //     try {
  //       const response =  await axios.post('https://aivispitchstackserver.azurewebsites.net/register', JSON.stringify(userData), config);
  //       console.log('Registered new user:', response.data);
  //     } catch (error) {
  //       console.error('Error posting data:', error);
  //     }
  //     try {
  //       const response =  await axios.post('https://aivispitchstackserver.azurewebsites.net/auth', JSON.stringify(userData), config);
  //       console.log('Logged in successfully', response.data);
  //       setTimeout(async () => {
  //       try {
  //         await refreshToken()
  //         setIsLogin(false);
  //         setCanLogin(false);
  //         setLoginState(username);
  //         setHasSubmitted(true);
  //       } catch (error) {
  //         console.error('Error requesting refreshtoken:', error);
  //       }
  //     }, 200)
  //     } catch (error) {
  //       console.error('Error posting data:', error.response ? error.response.data : error.message);
  //     }
  //   }
  // };

  // const handleLogout = async (e, action) => {
  //   e.preventDefault();
  //   const config = {
  //     headers: {'Content-Type': 'application/json'},
  //     withCredentials: true,
  //   }
  //   try {
  //     const response =  await axios.post('https://aivispitchstackserver.azurewebsites.net/logout', JSON.stringify(userData), config);
  //     console.log('Logged out successfully', response.data);
  //     setLogout();
  //     setIsLogin(false);
  //     setHasSubmitted(false);
  //     setCanLogout(false);
  //     setCanLogin(true);
  //   } catch (error) {
  //     console.error('Error posting data:', error);
  //   }
  // }