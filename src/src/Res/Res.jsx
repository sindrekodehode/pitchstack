import axios from 'axios';
import styles from './res.module.css'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/Context';
import { deleteResponse, fetchNewData } from '../Context/Context';
import { jsonrepair } from 'jsonrepair';




export function Res() {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const { fileHash, retryAttempt, setRetryAttempt } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        if (fileHash) {
                try {
                    const responseString = await fetchNewData(fileHash)
                    const responseObject = JSON.parse(responseString);
                    setResponse(responseObject);
                    setRetryAttempt(false);
                } catch (error) {
                    console.error("Error parsing response:", error);

                    try {
                    const responseString = await fetchNewData(fileHash)
                    const responseObject = JSON.parse(responseString);
                    setResponse(responseObject);
                    setRetryAttempt(false);

                    } catch (error) {
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
        }
    fetchData();
        }, [fileHash]);

        function getColor(rating) {
            switch (rating) {
                case "green" : 
                    return "/Green_pitchstack.svg";
                case "yellow": 
                    return "/yellow_pitchstack.svg";
                case "red": 
                    return "/red_pitchstack.svg";
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
                    <div>
                        <div className={styles.colorBox} >
                            <img src={ getColor(value.rating) } ></img>
                        </div>
                    </div>
                </div>
               ))}
            </div>
        </div>
    )
  }




  
