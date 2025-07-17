// src/pages/Room.jsx

import { useParams } from "react-router-dom";
import Question from "./Question";
import { useState, useEffect } from "react";
import socket from "../config/socket";
import api from "../api/api";
import { useSelector } from 'react-redux';

function Room() {
    const { code } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [topQuestions, setTopQuestions] = useState([]);

    const isHost = room && user && room.createdBy && room.createdBy._id === user._id;

    const fetchRoomAndQuestions = async () => {
        setLoading(true);
        try {
            const roomRes = await api.get(`/api/room/${code}`);
            setRoom(roomRes.data);
            const questionsRes = await api.get(`/api/room/${code}/question`);
            setQuestions(questionsRes.data);
        } catch (error) {
            console.error("Error fetching room data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        try {
            await api.post(`/api/room/${code}/summarize`);
        } catch (error) {
            console.error("Error summarizing questions:", error);
            alert(error.response?.data?.message || "Could not summarize questions.");
        }
    };

    useEffect(() => {
        fetchRoomAndQuestions();

        socket.emit("join-room", code);
        
        socket.on("new-question", (question) => {
            setQuestions((prev) => [question, ...prev]);
        });
        
        socket.on('question-deleted', (deletedQuestionId) => {
            setQuestions((prev) => prev.filter((q) => q._id !== deletedQuestionId));
        });

        socket.on('top-questions-generated', (summary) => {
            setTopQuestions(summary);
        });

        return () => {
            socket.off("new-question");
            socket.off("question-deleted");
            socket.off('top-questions-generated');
        };
    }, [code]);

    const handleDelete = async (questionId) => {
        if (!isHost) return;
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await api.delete(`/api/room/question/${questionId}`);
            } catch (error) {
                console.error("Error deleting question:", error);
            }
        }
    };

    if (loading) {
        return <div className="text-center text-white text-2xl p-10">Loading Room...</div>;
    }

    return (
        <div className="min-h-screen bg-indigo-950 py-10 px-4 md:px-10">
            <h2 className="text-white text-3xl font-bold text-center mb-2">Room Code: {code}</h2>
            <p className="text-center text-gray-300 mb-6">
                {isHost ? "You are the host of this room." : `Welcome, ${user?.name || 'participant'}.`}
            </p>

            {isHost && (
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleSummarize}
                        className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg font-semibold"
                    >
                        Summarize Questions with AI
                    </button>
                </div>
            )}

            {topQuestions.length > 0 && (
                <div className="mb-8 bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">✨ AI-Summarized Top Questions</h3>
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
                <div className="w-full max-w-3xl space-y-4 bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[50vh]">
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

            {!isHost && (
                <div className="flex justify-center mt-10">
                    <Question roomCode={code} />
                </div>
            )}
        </div>
    );
}

// --- START OF FIX ---
// This line was missing, which caused the error.
export default Room;
// --- END OF FIX ---
