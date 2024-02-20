import styles from './footer.module.css'

export function Footer() {

    return (
        <>
            <div className={styles.rainbowRoad}></div>
            <div className={styles.container}>
                <div className={styles.contactForm}>
                    <img src="/vis_logo1_RBG_vis_White.png" alt='vis logo' className={styles.logo}></img>
                    <ul>
                        <h2>Kontakt oss</h2>
                        <li>Vestlandets Innovasjonsselskap AS</li>
                        <li>Thormøhlens­gate 51,</li>
                        <li>5006 Bergen</li>
                    </ul>
                </div>
                <div className={styles.info}>
                    <ul>
                        <h2>Informasjon</h2>
                        <li>Personvernerklæring</li>
                        <li>Cookies</li>
                        <li>Åpenhetsloven</li>
                        <li>org. nr: 987 753 153</li>
                    </ul>
                </div>
            </div>
        </>
    )
}