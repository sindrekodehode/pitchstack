import styles from './header.module.css'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { AppContext, ContextProvider, refreshToken } from '../Context/Context';
import { doSignOut } from '../../../firebase/auth';
import { useAuth, getUser } from '../Context/authContext/index';

export function Header() {
  const { canLogout, setCanLogout, username, setUsername} = useContext(AppContext);
  const { currentUser, userLoggedIn } = useAuth();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        const user = await getUser();
        if (user.displayName) {
          setUsername(user.displayName.split('@')[0]) 
        } else {
          setUsername(user.email)
        }
      }
    };
    
    fetchUser();
    }, [currentUser]);

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