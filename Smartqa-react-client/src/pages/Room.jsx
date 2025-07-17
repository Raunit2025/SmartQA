import { useParams } from "react-router-dom";
import Question from "./Question";
import { useState, useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";
import socket from "../config/socket";
import axios from "axios";

function Room() {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}`, {
                withCredentials: true,
            });
            setRoom(response.data);
        } catch (error) {
            console.log(error);
            setErrors({
                message: "Unable to fetch room details, Please try again",
            });
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}/question`, {
                withCredentials: true,
            });
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
            setErrors({
                message: "Unable to fetch questions, Please try again",
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchRoom();
            await fetchQuestions();
            setLoading(false);
        };
        fetchData();

        socket.emit("join-room", code);

        socket.on("new-question", (question) => {
            setQuestions((prev) => [question, ...prev]);
        });

        return () => {
            socket.off("new-question");
        };
    }, []);

    const handleDelete = async (questionId) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this question?");
            if (!confirm) return;

            await axios.delete(`${serverEndpoint}/room/question/${questionId}`, {
                withCredentials: true,
            });

            setQuestions((prev) => prev.filter((q) => q._id !== questionId));
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Error deleting question. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-indigo-950 py-8 px-4">
            <h2 className="text-white text-center text-2xl font-bold mb-6">
                Room {code}
            </h2>

            <div className="flex justify-center mb-6">
                <div className="w-full max-w-2xl space-y-4 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[60vh]">
                    {questions.map((ques) => (
                        <div
                            key={ques._id}
                            className="flex items-start gap-4 bg-gray-50 rounded-md p-4 relative group"
                        >
                            {/* Avatar */}
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${ques.createdBy}`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border"
                            />

                            {/* Message box */}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-indigo-700">
                                    {ques.createdBy || "Anonymous"}
                                </p>
                                <p className="text-gray-800 text-base">{ques.content}</p>
                            </div>

                            {/* Delete Button - visible on hover */}
                            <button
                                onClick={() => handleDelete(ques._id)}
                                className="absolute top-2 right-2 text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded transition"
                                title="Delete"
                            >
                                Delete
                            </button>


                        </div>
                    ))}

                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <Question roomCode={code} />
                </div>
            </div>
        </div>
    );
}

export default Room;
