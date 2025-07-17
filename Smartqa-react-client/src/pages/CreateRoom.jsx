// src/pages/CreateRoom.jsx

import { useNavigate } from "react-router-dom";
import api from "../api/api"; // <-- THIS IS THE MOST IMPORTANT CHANGE
import { useState } from "react";
import { useSelector } from 'react-redux';

function CreateRoom() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Now we use 'api' which has our interceptor
            const response = await api.post(`/api/room`, {}); 
            navigate(`/room/${response.data.roomCode}`);
        } catch (error) {
            console.error("Error in CreateRoom.jsx handleSubmit:", error);
            setErrors({ message: error.response?.data?.message || "Error creating room, please try again" });
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
