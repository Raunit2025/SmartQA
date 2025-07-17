// src/pages/Room.jsx

import { useParams } from "react-router-dom";
import Question from "./Question";
import { useState, useEffect } from "react";
import socket from "../config/socket";
import api from "../api/api"; // <-- IMPORT our new instance
import { useSelector } from 'react-redux';

function Room() {
    const { code } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [topQuestions, setTopQuestions] = useState([]);

    // Check if the logged-in user is the one who created the room
    const isHost = room && user && room.createdBy && room.createdBy._id === user._id;

    const fetchTopQuestions = async () => {
        try {
            // Use 'api' and a relative path
            const response = await api.get(`/api/room/${code}/top-questions`);
            setTopQuestions(response.data || []);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch top questions' });
        }
    }

    const fetchRoom = async () => {
        try {
            // Use 'api' and a relative path
            const response = await api.get(`/api/room/${code}`);
            setRoom(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch room details, Please try again" });
        }
    };

    const fetchQuestions = async () => {
        try {
            // Use 'api' and a relative path
            const response = await api.get(`/api/room/${code}/question`);
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch questions, Please try again" });
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

        socket.on('question-deleted', (deletedQuestionId) => {
            // Update the state by filtering out the deleted question
            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q._id !== deletedQuestionId)
            );
        });

        return () => {
            socket.off("new-question");
            socket.off("question-deleted");
        };
    }, [code]);

    const handleDelete = async (questionId) => {
        if (!isHost) {
            alert("You are not authorized to delete this question.");
            return;
        }

        try {
            const confirm = window.confirm("Are you sure you want to delete this question?");
            if (!confirm) return;

            // The API call is all we need. The state update will now be handled
            // by the socket event listener we just added.
            await api.delete(`/api/room/question/${questionId}`);

        } catch (error) {
            console.error("Error deleting question:", error);
            alert(error.response?.data?.message || "Error deleting question. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-indigo-950 py-10 px-4 md:px-10">
            <h2 className="text-white text-3xl font-bold text-center mb-8">Room Code: {code}</h2>
            <p className="text-center text-gray-300 mb-6">Room created by: <span className="font-semibold">{room?.createdBy?.name || '...'}</span></p>

            {isHost && (
                <div className="flex justify-center">
                    <button
                        onClick={fetchTopQuestions}
                        className="px-5 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow"
                    >
                        Get Top Questions
                    </button>
                </div>
            )}

            {topQuestions.length > 0 && (
                <div className="mt-8 bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-800">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topQuestions.map((question, index) => (
                                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-2 font-medium">{index + 1}</td>
                                        <td className="px-4 py-2">{question}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <div className="w-full max-w-3xl space-y-4 bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[60vh]">
                    {questions.map((ques) => (
                        <div
                            key={ques._id}
                            className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 relative border border-gray-200 hover:shadow-md transition"
                        >
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${ques.createdBy}`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-indigo-700">
                                    {ques.createdBy || "Anonymous"}
                                </p>
                                <p className="text-gray-900 text-base mt-1">{ques.content}</p>
                            </div>
                            {isHost && (
                                <button
                                    onClick={() => handleDelete(ques._id)}
                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition"
                                    title="Delete question"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-2xl">
                    <Question roomCode={code} />
                </div>
            </div>
        </div>
    );
}

export default Room;