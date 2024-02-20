import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { jsonrepair } from 'jsonrepair';

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
    const [checkedState, setCheckedState] = useState({});
    const [retryAttempt, setRetryAttempt] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const loginState = localStorage.getItem('loginState');
        const storedUsername = localStorage.getItem('username');

        if (loginState === 'true' && storedUsername) {
            setIsLogin(false);
            setCanLogin(false);
            setHasSubmitted(true);
            setUsername(storedUsername);
        }
    }, []);

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
        setSelectedFileNames,
        checkedState, 
        setCheckedState,
        retryAttempt,
        setRetryAttempt,
        isLogin,
        setIsLogin,
        username,
        setUsername,
        password,
        setPassword

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
        const refresh = await axios.post('https://aivispitchstackserver.azurewebsites.net/refresh', {}, config);


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
};

export async function checkLoginState() {
    const itemStr = localStorage.getItem("loginState");

    if (!itemStr) {
        return { hasSubmitted: false };
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
       return await axios.post('https://aivispitchstackserver.azurewebsites.net/refresh', {}, config);
    } catch (error) {
        console.error("Error fetching cookie:", error);
    }

    if (now.getTime() > item.expiry) {
        localStorage.removeItem("loginState");
        return { hasSubmitted: false };
    }

    return {
        hasSubmitted: item.hasSubmitted,
        username: item.username,
    }
};

export function setLogout() {
    localStorage.removeItem("loginState");
};



export async function fetchNewData(fileHash) {
        const config = {
            withCredentials: true,
        }
        try {
            const response = await axios.get(`https://aivispitchstackserver.azurewebsites.net/uploads/${fileHash}`, config);

            if (response?.data) {
                let responseString = response.data[0]?.body?.data[0]?.content[0]?.text?.value;

                    if (responseString !== undefined) {
                        responseString = responseString.replace(/^```(plaintext|json)\s*|\s*```$/g, '').trim()
                        const repairedString = jsonrepair(responseString);
                        return repairedString;
                    } else {
                        console.error("responseString is undefined");
                    }
                } else {
                    console.error("response.data is undefined");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        };

export function deleteResponse(fileHash) {
        const config = {
            withCredentials: true,
        }
        axios.delete(`https://aivispitchstackserver.azurewebsites.net/uploads/${fileHash}`, config)
            .then(response => console.log("Deleted response successfully", response))
            .catch(error => Promise.reject(error));
    };