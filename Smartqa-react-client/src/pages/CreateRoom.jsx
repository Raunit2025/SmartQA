// src/pages/CreateRoom.jsx

import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import { useState } from "react";
import { useSelector } from 'react-redux'; // Import useSelector

function CreateRoom() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    // Get user details from Redux store to display their name
    const { user } = useSelector((state) => state.auth);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // The backend now gets the user from the JWT token,
            // so we don't need to send the name in the body.
            const response = await axios.post(`${serverEndpoint}/api/room`, {});
            navigate(`/room/${response.data.roomCode}`);
        } catch (error) {
            console.error(error);
            setErrors({ message: "Error creating room, please try again" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Create a New Room</h2>
                <p className="text-center text-gray-600 mb-6">You are creating this room as: <span className="font-semibold">{user?.name}</span></p>
                
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg transition duration-200 text-lg"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Room"}
                </button>

                {errors.message && (
                    <p className="text-red-600 text-center mt-4 text-sm">{errors.message}</p>
                )}
            </div>
        </div>
    );
}

export default CreateRoom;