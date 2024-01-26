import axios from 'axios';
import styles from './res.module.css'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/Context';



export function Res() {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const { fileHash } = useContext(AppContext);

    useEffect(() => {
        if (fileHash) {
            const config = {
                headers: {'Content-Type': 'multipart/form-data'},
                withCredentials: true,
            }
            axios.get(`https://7cca-20-223-156-203.ngrok-free.app/${fileHash}`, config)
                .then(response => {
                    let responseString = response.data[0].body.data[0].content[0].text.value;
                    responseString = responseString.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
                    const responseObject = JSON.parse(responseString);
                    setResponse(responseObject);
                })
                .catch(error => {
                    setError(error.message)
                })
    }}, [fileHash]);

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
                    <p>{value.item}</p>
                    <p>{value.evaluation}</p>
                    </div>
                    <div className={styles.colorBox} style={{ backgroundColor: getColor(value.rating) }}>
                    </div>
                </div>
               ))}
            </div>
        </div>
    )
  }




  
