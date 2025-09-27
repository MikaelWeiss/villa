import styles from './ButtonLink.module.css'
function ButtonLink({ text, link }) {
    return (
        <a href={link}>
            <button className={styles.button}>
                {text}
            </button>
        </a>
    )
}

export default ButtonLink;