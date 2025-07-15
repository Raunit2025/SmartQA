import { useNavigate } from "react-router-dom";

function CreateRoom() {
    const [name, setName] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if(name.length === 0) {
            isValid = false;
            newErrors.name = "Name is Mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className="container py-5">
            <h2>CreateRoom</h2>
        </div>
    );
}

export default CreateRoom;