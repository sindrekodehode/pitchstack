import styles from './faq.module.css'

export function FAQ() {

    return (
        <>
            <div className={styles.container}>
                <ul className={styles.list}>
                    <li>Q: How does it work?  </li>
                    A:Simply drop a pitch pdf in the field and wait for the results to show up.
                    <li>Q: I'm not getting a result / the result is not as expected. </li>
                    A: The pdf needs to contain text in order for the interpreter to work.  If the pdf is a collection of images or if there is very little text, the result may be incorrect.
                    <li>Q: My pdf is correct, but I'm still not getting a result. </li>
                    A: You can try to create a new user and upload the pdf again, if it still doesn't show any result, please contact VIS for further instructions.
                    <li>Tbd</li>
                    <li>Tbd</li>
                    <li>Tbd</li>
                </ul>
            </div>
        </>
    )
}