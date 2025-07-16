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
                withCredentials: true
            });
            setRoom(response.data);
        } catch (error) {
            console.log(error);
            setErrors({
                message: 'Unable to fetch room details, Please try again'
            });
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}/question`, {
                withCredentials: true
            });
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
            setErrors({
                message: 'Unable to fetch questions, Please try again'
            });
        }
    }
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

    return (
        <div className="min-h-screen bg-indigo-950 py-8 px-4">
            <h2 className="text-white text-center text-2xl font-bold mb-6">Room {code}</h2>

            <div className="flex justify-center mb-6">
                <ul className="space-y-3 w-full max-w-xl">
                    {questions.map((ques) => (
                        <li
                            key={ques._id}
                            className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm"
                        >
                            {ques.content}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-xl">
                    <Question roomCode={code} />
                </div>
            </div>
        </div>

    );
}

export default Room;