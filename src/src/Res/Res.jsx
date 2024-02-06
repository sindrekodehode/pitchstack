import axios from 'axios';
import styles from './res.module.css'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/Context';
import { deleteResponse, fetchNewData } from '../Context/Context';



export function Res() {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const { fileHash, retryAttempt, setRetryAttempt } = useContext(AppContext);

    useEffect(() => {
        const fetchData = async () => {
        if (fileHash) {
            const normalizedResponseString = fetchNewData(fileHash)
                try {
                    const responseObject = JSON.parse(normalizedResponseString);
                    setResponse(responseObject);
                    setRetryAttempt(false);
                } catch (error) {
                    console.error("Error parsing response:", error);

                    if (!retryAttempt) {
                        setRetryAttempt(true);

                        deleteResponse(fileHash).then(() => {
                            navigate('/');
                        }).catch(deleteError => {
                            console.error("Error deleting the problematic response:", deleteError);
                            setError("Failed to delete and re-fetch the data");
                        }); 
                    } else {
                        deleteResponse(fileHash);
                        setError("Failed to parse response after retry. Original error:" + error.message);
                    }
                }
            }
        }
    fetchData();
        }, [fileHash]);

    function getColor(rating) {
        switch (rating) {
            case "green" : 
                return "#054E17";
            case "yellow": 
                return "#8E9A0E";
            case "red": 
                return "#352320";
            default:
                return "grey";
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.stats}>
               {Object.entries(response).map(([key, value]) => (
                <div key={key} className={styles.itemCard}>
                    <div className={styles.cardText}>
                    <h3>{key}:</h3>
                    <p>{value.item || 'No item provided'}</p>
                    <p>{value.evaluation || 'No evaluation provided'}</p>
                    </div>
                    <div className={styles.colorBox} style={{ backgroundColor: getColor(value.rating) }}>
                    </div>
                </div>
               ))}
            </div>
        </div>
    )
  }




  
