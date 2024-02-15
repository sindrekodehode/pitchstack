import styles from './aside.module.css'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/Context';
import { deleteResponse, fetchNewData } from '../../Context/Context';
import { jsonrepair } from 'jsonrepair';

export function Aside() {
    const [responseObj, setResponseObj] = useState([]);
    const [error, setError] = useState(null);
    const { hasSubmitted, setSelectedPDFData, setSelectedFileNames, selectedFileNames, checkedState, setCheckedState } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(true);

    const handleRadioButtonChange =  async (fileHash, fileName) => {
        
        try {
            const responseString = await fetchNewData(fileHash)
            const responseObject = JSON.parse(responseString);
                
            setSelectedPDFData([{ hash: fileHash, data: responseObject }]);
            setSelectedFileNames([{ hash: fileHash, originalFileName: fileName }]);
               
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

    function shortenPdfName(filename) {
        let shortenedFilename = filename.replace(/\.pdf$/i, '');
        if (shortenedFilename.length > 20) {
            shortenedFilename = shortenedFilename.substring(0, 20);
        }
        return shortenedFilename
    }


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
                    <div className={styles.radioContainer} key={index}>
                        <input type="radio" id={`pdf-${index}`} checked={checkedState[element.hash] || false} onChange={(e) => handleRadioButtonChange(element.hash, element.originalFileName)} value="1"></input>
                        <label htmlFor={`pdf-${index}`}>{shortenPdfName(element.originalFileName)}</label>
                    </div>
                ))}
                
            </div>)}
        </div>
    );
}


