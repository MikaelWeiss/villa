import ButtonLink from "./ButtonLink.js";
import styles from "./TenantPreviewCard.module.css";
function TenantPreviewCard({ icon, infoComponent, buttons}) {
    return (
        <div className={styles.container}>
            {icon}
            {infoComponent}
            <div className={styles.buttonContainer}>
                {buttons.map((button) => (
                    <ButtonLink 
                        link={button.link} 
                        text={button.text}
                        key={crypto.randomUUID()}
                    />
                ))}
            </div>
        </div>
    )
}

export default TenantPreviewCard;