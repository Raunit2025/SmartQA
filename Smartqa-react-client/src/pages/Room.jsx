import { useParams } from "react-router-dom";
import Question from "./Question";

function Room() {
    const { code } = useParams();

    return (
        <div className=" bg-indigo-950">
            <h2 className="text-white text-center font-bold">Room {code}</h2>
            <Question roomCode={code} />
        </div>
    );
}

export default Room;