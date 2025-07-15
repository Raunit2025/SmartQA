import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }
        if (!roomCode.trim()) {
            newErrors.roomCode = "Room code is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleJoin = () => {
        if (validate()) {
            // Save name to localStorage
            localStorage.setItem("name", name);

            // Navigate to room page
            navigate(`/room/${roomCode}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Room</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.roomCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />
                    {errors.roomCode && <p className="text-red-500 text-sm mt-1">{errors.roomCode}</p>}
                </div>

                <button
                    type="button"
                    onClick={handleJoin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Join Room
                </button>
            </div>
        </div>
    );
}

export default JoinRoom;
