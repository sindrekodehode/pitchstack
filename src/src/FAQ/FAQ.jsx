import { useState } from 'react'
import styles from './faq.module.css'

const faqData = [
    {id: 1, question: "How do I use the pitchstack reviewer?", answer: "Simply drop a pitch pdf in the field and wait for the results to show up."},
    {id: 2, question: "How does it work?", answer: "The reviewer uploads the pdf to a GTP Assistant that reads through the pdf and responds based on a predetermined prompt."},
    {id: 3, question: "I'm not getting a result / the result is not as expected.", answer: "The pdf needs to contain text in order for the interpreter to work.  If the pdf is a collection of images or if there is very little text, the result may be incorrect."},
    {id: 4, question: "My pdf is correct, but I'm still not getting a result.", answer: "You can try to create a new user and upload the pdf again, if it still doesn't show any result, please contact VIS for further instructions."},
    {id: 5, question: "TBD", answer: "Placeholder"},
];

export function FAQ() {

    const [openItemId, setOpenItemId] = useState(null);

    const toggleItem = (id) => {
        setOpenItemId(openItemId === id? null : id);
    };

return (
        <div className={styles.container}>
            {faqData.map(({ id, question, answer }) => (
                <div key={id} onClick={() => toggleItem(id)} className={styles.list}>
                    <div className={styles.qdiv}><h2>{question}</h2><img src='/darrow.svg' alt='double arrow pointing down' className={styles.darrow}></img></div>
                {openItemId === id && <div><h2>{answer}</h2></div>}
                </div>
            ))}
        </div>
    );
};
