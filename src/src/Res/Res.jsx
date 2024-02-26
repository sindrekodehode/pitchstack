import axios from 'axios';
import styles from './res.module.css'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/Context';
import { fetchNewData } from '../Context/Context';
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
                    setError("Failed to fetch data");
                }
            }
        }
    fetchData();
        }, [fileHash, retryAttempt, setRetryAttempt, navigate]);

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

    function calculateScore(responseData) {
        let totalScore = 0
        Object.values(responseData).forEach(item => {
            switch (item.rating) {
                case "green":
                    totalScore += 3;
                    break;
                case "yellow":
                    totalScore += 1;
                    break;
                case "red":
                    break;
                    default:
                    break;
            }    
        });
        
        const scoreValue = Math.floor((totalScore / 66) *100);
        return scoreValue;
    }

    const score = calculateScore(response);
    
    return (
        <div className={styles.container}>
            <div className={styles.stats}>
            <div className={styles.pdfcontainer}>
                <div className={styles.pdfstats}>
                <div className={styles.score}><h2>Your pitchscore </h2><div className={styles.scoreNum}>{score}</div></div>
                <div className={styles.infographic}><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore inventore esse, labore hic optio, nam explicabo, voluptates modi officiis suscipit assumenda veritatis repudiandae ipsam amet porro? Fugit aspernatur quas quam expedita facilis suscipit, nulla, dolorem reiciendis numquam itaque beatae. Necessitatibus, nam in! Quisquam necessitatibus tenetur fuga obcaecati dignissimos unde harum.</p></div>
               
                        {Object.entries(response).map(([key, value]) => (
                            <div key={key} className={styles.itemCard}>
                            <div className={styles.cardText}>
                            <div className={styles.cardTextHeaderContainer}>
                                <div className={styles.colorBox} >
                                    <img src={ getColor(value.rating) } alt='crab color rating image'></img>
                                </div>
                                <div className={styles.textcontainer}>
                                    <h3>{key}:</h3>
                                </div>
                            </div>
                            <p>{value.item}</p>
                            <p>{value.evaluation}</p>
                            </div>
                            
                        </div>
                        ))}

                   </div>
                </div>
            </div>
        </div>
    )
  }




  
