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
    const [uploadType, setUploadType] = useState("pitch");

    useEffect( () => {
        const initializeState = async () => {
            const loginStateStr = localStorage.getItem('loginState');
            const loginState = loginStateStr ? JSON.parse(loginStateStr) : null;
            if (loginState?.hasSubmitted && loginState !== null) {
                const storedUsername = loginState.username;
                await refreshToken();
                setIsLogin(false);
                setCanLogin(false);
                setHasSubmitted(true);
                setUsername(storedUsername);
            }  
        };
        initializeState();
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
        setPassword,
        uploadType,
        setUploadType

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
        localStorage.removeItem("loginState");
        return { hasSubmitted: false };
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
        const refreshResult = await refreshToken();
        if (refreshResult && refreshResult.expiresIn) {
            const expiresInMs = parseInt(refreshResult.expiresIn) * 1000;
            const updatedExpiry = now.getTime() + expiresInMs
            item.expiry = updatedExpiry;
            localStorage.setItem("loginState", JSON.stringify(item));
        }
    } catch (error) {
        console.error("Error fetching cookie:", error);
        localStorage.removeItem("loginState");
        return { hasSubmitted: false };
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
            

            if (response) {
                let responseObj;
                try {
                    responseObj = JSON.parse(response.data.pitchresponse.response);
                } catch (error) {
                    console.error("Error parsing the response:", error);
                }
                let evaluationString;
                let firstMessageContent = responseObj.body.data[0];
                evaluationString = firstMessageContent.content[0].text.value;
                const fixedString = evaluationString.replace(/^```(plaintext|json|javascript)?\s*(plaintext|json|javascript)?\s*\n?|\n?\s*```$/gm, '').trim()
                const repairedString = jsonrepair(fixedString)

                    return repairedString
                }
                // let responseString = response.data?.pitchresponse?.response?.body?.data[0]?.content[0]?.text?.value;

                //     if (responseString !== undefined) {
                //         responseString = responseString.replace(/^```(plaintext|json|javascript)?\s*(plaintext|json|javascript)?\s*\n?|\n?\s*```$/gm, '').trim()
                //         const repairedString = jsonrepair(responseString);
                //         return repairedString;
                //     } else {
                //         console.error("responseString is undefined");
                //     }
                // } else {
                //     console.error("response.data is undefined");
                // }
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