import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-950 text-white text-center px-4">
            <h2 className="text-3xl font-bold mb-4">SmartQA - Get Started</h2>
            <p className="mb-2 text-lg max-w-md">
                Click on Create Room if you are the host to get started. Share the code with participants.
            </p>
            <p className="mb-6 text-lg max-w-md">
                If you are a participant, then click on Join Room. Ask for room code from the host of the meeting.
            </p>
            <div className="space-x-4">
                <Link
                    to="/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Create Room
                </Link>
                <Link
                    to="/join"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Join Room
                </Link>
            </div>
        </div>
    );
}

export default Home;
