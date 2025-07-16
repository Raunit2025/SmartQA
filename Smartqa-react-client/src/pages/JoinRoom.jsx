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

        if (name.trim().length === 0) {
            isValid = false;
            newErrors.name = "Name is mandatory";
        }

        if (roomCode.trim().length === 0) {
            isValid = false;
            newErrors.roomCode = "Room Code is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            localStorage.setItem("participant-name", name);
            navigate(`/room/${roomCode}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Room</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.name
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        id="roomCode"
                        name="roomCode"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="Enter room code"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.roomCode
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />
                    {errors.roomCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.roomCode}</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default JoinRoom;
