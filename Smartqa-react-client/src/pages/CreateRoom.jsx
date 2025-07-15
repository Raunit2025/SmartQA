import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import { useState } from "react";

function CreateRoom() {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (!name || name.trim().length === 0) {
            isValid = false;
            newErrors.name = "Name is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${serverEndpoint}/room`,
                    { createdBy: name },
                    { withCredentials: true }
                );
                navigate(`/room/${response.data.roomCode}`);
            } catch (error) {
                console.error(error);
                setErrors({ message: "Error creating room, please try again" });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Room</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                        }`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {errors.message && (
                    <p className="text-red-600 text-center mt-4 text-sm">{errors.message}</p>
                )}
            </div>
        </div>
    );
}

export default CreateRoom;
