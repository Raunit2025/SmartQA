import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'; // Import useSelector

function JoinRoom() {
    // The user's name is now managed by Redux, so we don't need a local state for it.
    const [roomCode, setRoomCode] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    // Get user details from the Redux store
    const { user } = useSelector((state) => state.auth);

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (roomCode.trim().length === 0) {
            isValid = false;
            newErrors.roomCode = "Room Code is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            // We no longer need to set the participant name in localStorage.
            // The `Question` component will get the name from the authenticated user session on the backend.
            navigate(`/room/${roomCode}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Join Room</h2>
                <p className="text-center text-gray-600 mb-6">You are joining as: <span className="font-semibold">{user?.name}</span></p>

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
                    Join Room
                </button>
            </div>
        </div>
    );
}

export default JoinRoom;