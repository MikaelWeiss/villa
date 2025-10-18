import ButtonLink from "./ButtonLink.js";
import Card from "./ui/Card.js";

function TenantPreviewCard({ icon, infoComponent, buttons}) {
    return (
        <Card>
            <div className="flex items-start gap-6">
                <div className="text-secondary-400 flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    {infoComponent}
                </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
                {buttons.map((button) => (
                    <ButtonLink
                        link={button.link}
                        text={button.text}
                        key={crypto.randomUUID()}
                    />
                ))}
            </div>
        </Card>
    )
}

export default TenantPreviewCard;
