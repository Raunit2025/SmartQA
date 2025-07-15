import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import axios from 'axios';
import { useState } from "react";

function CreateRoom() {
    const [name, setName] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (name.length === 0) {
            isValid = false;
            newErrors.name = "Name is Mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                await axios.post(`${serverEndpoint}/room`, {
                    createdBy: name
                }, {
                    withCredentials: true
                });
                navigate(`/room/${Response.data.roomCode}`);
            } catch (error) {
                console.log(error);
                setErrors({ message: 'Error creating room, please try again' });
            }
        }
    };

    return (
        <div className="container py-5">
            <h2>CreateRoom</h2>
        </div>
    );
}

export default CreateRoom;