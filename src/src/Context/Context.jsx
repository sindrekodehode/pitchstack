import { createContext, useContext, useState } from 'react'
import axios from 'axios';

export const AppContext = createContext()

export const context = () => {
    return useContext(AppContext);
};

export const ContextProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState('');
    const [selectedPDFData, setSelectedPDFData] = useState([]);
    const [fileHash, setFileHash] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [canLogin, setCanLogin] = useState(false);
    const [canLogout, setCanLogout] = useState(false);
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    

    const value = {
        accessToken,
        setAccessToken,
        selectedPDFData,
        setSelectedPDFData,
        fileHash,
        setFileHash,
        hasSubmitted,
        setHasSubmitted,
        canLogin,
        setCanLogin,
        canLogout,
        setCanLogout,
        selectedFileNames,
        setSelectedFileNames
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const refreshToken = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
    };
    try {
        const refresh = await axios.post('https://88b3-20-223-156-203.ngrok-free.app/refresh', {}, config);


    } catch (error) {
        console.error('Error refreshing token:', error);
    }
};


export function setLoginState(user) {
    const now = new Date();
    const item = {
        hasSubmitted: true,
        username: user,
        expiry: now.getTime() + (24 * 60 * 60 * 10000),
    };
    localStorage.setItem("loginState", JSON.stringify(item));
}

export function checkLoginState() {
    const itemStr = localStorage.getItem("loginState");

    if (!itemStr) {
        return { hasSubmitted: false };
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem("loginState");
        return { hasSubmitted: false };
    }

    return {
        hasSubmitted: item.hasSubmitted,
        username: item.username,
    }
}

export function setLogout() {
    localStorage.removeItem("loginState");
}