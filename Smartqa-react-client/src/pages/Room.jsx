import { useParams } from "react-router-dom";
import Question from "./Question";
import { useState, useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";

function Room() {
    const { code } = useParams();
    const [loading, serLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);

    const fetchRoom = async () => {
        try{
            const response = await axios.get(`${serverEndpoint}/room/${code}`,{
                withCredentials: true
            });
            setRoom(response.data);
        }catch(error){
            console.log(error);
            setErrors({
                message: 'Unable to fetch room details, Please try again'
            });
        }
    };

    const fetchQuestions = async () => {
        try{
            const response = await axios.get(`${serverEndpoint}/room/${code}/question`,{
                withCredentials: true
            });
            setQuestions(response.data);
        }catch(error){
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
        <div className=" bg-indigo-950">
            <h2 className="text-white text-center font-bold">Room {code}</h2>
            <Question roomCode={code} />
        </div>
    );
}

export default Room;