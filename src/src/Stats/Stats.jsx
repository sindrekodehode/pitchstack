import styles from './stats.module.css';
import { Aside } from './components/Aside';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext, checkLoginState } from '../Context/Context';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';

export function Stats() {
    const { selectedPDFData, hasSubmitted, selectedFileNames } = useContext(AppContext);

    function generatePDF() {
        html2canvas(document.body).then(canvas => {
            const imageData = canvas.toDataURL('image/png');
            const docDefinition = {
                content: [{
                    image: imageData,
                    width: 500,
                }],
            };
            console.log("selectedFileNames[0].originalFileName:", selectedFileNames[0].originalFileName)
            pdfMake.createPdf(docDefinition).download(`pitchstack.pdf`);
        });
    }




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
       

    function calculateWeightScore(data) {
        switch (data) {
            case "green":
                return 3;
            case "yellow":
                return 1;
            case "red":
                return 0;
            default:
                return 0;       
        }
    }

    const ratings = [10, 9, 8, 20, 14, 5, 5, 5, 0.5, 0.5, 1, 0.5, 8, 0.5, 0.5, 5, 3, 1, 0.5, 1, 1, 1];

    function calculateWeightedScore(responseData, ratings) {
        let totalScore = 0;
        Object.entries(responseData).forEach(([key, value], index) => {
            const ratingValue = calculateWeightScore(value.rating);
            if (index < ratings.length) {
                const weight = ratings[index] ?? 0;
                totalScore += ratingValue * weight;
            }
        });
        const scoreValue = Math.floor((totalScore / 300) * 100);
        return scoreValue;
    };



    useEffect(() => {
        checkLoginState()
    })

    return (
        <div className={styles.container}>
            <Aside />
            {hasSubmitted && (
                <div className={styles.stats}>
                    {selectedPDFData.map((pdfData, index) => {
                        const weightedScore = calculateWeightedScore(pdfData.data, ratings);
                        return (
                        <div key={index} className={styles.pdfcontainer}>
                            <div className={styles.pdfstats}>
                            <div className={styles.score}><h2>Your pitchscore </h2><div className={styles.scoreNum}>{weightedScore}</div></div>
                            <div className={styles.infographic}><p>The pitchstack replicates a VC fundmember that is an industry expert. In a similar way to how one expert might give a different score than another when reviewing a pitchstack the pitchstack AI will also vary in its scoring.  When weighted against previous pitchstacks that have done well and ones that have done poorly, there is a good correlation between scoring highly and the subsequent success of the startup. </p></div>
                            <div className={styles.pdfBtnContainer}><button className={styles.pdfBtn} onClick={() => generatePDF() }>Download as PDF</button></div>
                            {pdfData.data && Object.entries(pdfData.data).map(([key, value]) => (
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
                        );
                    })}
                </div>
            )}
        </div>
    );
  }