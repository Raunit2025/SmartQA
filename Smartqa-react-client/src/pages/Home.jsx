// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'; // <-- Import useSelector from react-redux

function Home() {
    // Get the user from the Redux store's auth state
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-950 text-white text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Welcome to SmartQA</h2>
            
            {user ? (
                // This view is shown IF THE USER IS LOGGED IN
                <>
                    <p className="mb-6 text-lg max-w-md">
                        You are logged in as <span className="font-bold">{user.name}</span>. Create a new room or join an existing one.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                        >
                            Create Room
                        </Link>
                        <Link
                            to="/join"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                        >
                            Join Room
                        </Link>
                    </div>
                </>
            ) : (
                // This view is shown IF THE USER IS NOT LOGGED IN
                <>
                    <p className="mb-6 text-lg max-w-md">
                        The best way to handle audience questions. Please log in or register to get started.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                        >
                            Register
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
