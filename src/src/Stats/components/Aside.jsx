import styles from './aside.module.css'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/Context';

export function Aside() {
    const [responseObj, setResponseObj] = useState([]);
    const [error, setError] = useState(null);
    const { hasSubmitted, setSelectedPDFData, setSelectedFileNames, selectedFileNames } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(true);
    const [checkedState, setCheckedState] = useState({});

    const handleCheckBoxChange =  async (fileHash, isChecked, fileName) => {
        const checkedCount = Object.values(checkedState).filter(val => val).length;

        if (isChecked && checkedCount >= 2) {
            console.log("Can't check more than 2 boxes");
            return;
        }

        setCheckedState(prevState => ({
            ...prevState,
            [fileHash]: isChecked
        }));
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        };

        try {
            const response = await axios.get(`https://aivispitchstackserver.azurewebsites.net/uploads/${fileHash}`, config);
            
            let responseString = response.data[0].body.data[0].content[0].text.value;
            responseString = responseString.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
            const responseObject = JSON.parse(responseString);
                
            setSelectedPDFData(currentSelected => {
                const isAlreadySelected = currentSelected.some(data => data.hash === fileHash);
                if (isAlreadySelected) {
                    return currentSelected.filter(data => data.hash !== fileHash);
                } else {
                    return [...currentSelected.slice(-1), {hash: fileHash, data: responseObject }];
                }
            });

        if (isChecked) {
            setSelectedFileNames(prev => [...prev, {hash: fileHash, originalFileName: fileName}]);
        } else {
            setSelectedFileNames(prev => prev.filter(file => file.hash !== fileHash));
        }
               
        } catch (error) {
            console.error("Error fetching PDF data:", error);
        }
    }


    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        
        axios.get("https://aivispitchstackserver.azurewebsites.net/uploads", config)
        .then(response => {
            const responseData = response.data;
            const pdfArray = Object.keys(responseData).map(hash => {
                return {
                    hash: hash,
                    ...responseData[hash]
                };
            });
            setResponseObj(pdfArray);
            console.log(response);
        })
        .catch(error => {
            setError(error);
            console.error('Error fetching data:', error);
        })
        
    }, []);


    useEffect(() => {
        if (responseObj.length > 0) {
            console.log("Crab");
        }
    }, [responseObj]);
    
    return (

        <div className={styles.asideContainer}>
            <img src='/menu.svg' onClick={() => setIsOpen(!isOpen)} className={styles.menu}></img>
            {hasSubmitted && isOpen && (
            <div className={styles.aside}>
                <h3>Tidligere resultater</h3>
                {responseObj.map((element, index) => (
                    <div key={index}>
                        <input type="checkbox" id={`pdf-${index}`} checked={checkedState[element.hash] || false} onChange={(e) => handleCheckBoxChange(element.hash, e.target.checked, element.originalFileName)} value="1"></input>
                        <label htmlFor={`pdf-${index}`}>{element.originalFileName}</label>
                    </div>
                ))}
                
            </div>)}
        </div>
    );
}


