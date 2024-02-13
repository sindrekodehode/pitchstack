import styles from './stats.module.css'
import { Aside } from './components/Aside'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { AppContext, checkLoginState } from '../Context/Context';

export function Stats() {
    const { selectedPDFData, hasSubmitted, selectedFileNames } = useContext(AppContext);

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
    
    function calculateScore(pdfData) {
        let totalScore = 0

        
        Object.values(pdfData.data).forEach(value => {
            switch (value.rating) {
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


    useEffect(() => {
        checkLoginState()
    })

    return (
        <div className={styles.container}>
            <Aside />
            {hasSubmitted && (
                <div className={styles.stats}>
                    {selectedPDFData.map((pdfData, index) => {
                        const score = calculateScore(pdfData);

                        return (
                        <div key={index} className={styles.pdfcontainer}>
                            {/* <h2>{selectedFileNames.find(file => file.hash === pdfData.hash)?.originalFileName || "Unknown FileName"}</h2> */}
                            <div className={styles.pdfstats}>
                            <div className={styles.score}><h1>Your pitchscore: <span className={styles.scoreNum}><h1>{score}</h1></span></h1></div>
                            {pdfData.data && Object.entries(pdfData.data).map(([key, value]) => (
                                <div key={key} className={styles.itemCard}>
                                    <div className={styles.cardText}>
                                    <h3>{key}:</h3>
                                    <p>{value.item}</p>
                                    <p>{value.evaluation}</p>
                                    </div>
                                    <div className={styles.colorBox} >
                                        <img src={ getColor(value.rating) } ></img>
                                    </div>
                                </div>
                            ))}

                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
  }