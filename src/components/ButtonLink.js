import { Link } from "react-router-dom";
import Button from './ui/Button';

function ButtonLink({ text, link }) {
    return (
        <Link to={link}>
            <Button>{text}</Button>
        </Link>
    )
}

export default ButtonLink;
