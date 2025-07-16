import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function Question({ roomCode }) {
    const [question, setQuestion] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (question.trim().length === 0) {
            isValid = false;
            newErrors.question = "Question is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const participantName = localStorage.getItem("participant-name") || "Anonymous";

                const response = await axios.post(
                    `${serverEndpoint}/room/${roomCode}/question`,
                    {
                        content: question,
                        createdBy: participantName,
                    },
                    {
                        withCredentials: true,
                    }
                );

                console.log(response);
                setQuestion("");
                setErrors({});
            } catch (error) {
                console.error(error);
                setErrors({ message: "Error posting question, please try again" });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ask a Question</h2>

                <div className="mb-4">
                    <textarea
                        id="question"
                        name="question"
                        rows="3"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                            errors.question
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-indigo-500"
                        }`}
                    />
                    {errors.question && (
                        <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Submit
                </button>

                {errors.message && (
                    <p className="text-red-600 text-center text-sm mt-4">{errors.message}</p>
                )}
            </div>
        </div>
    );
}

export default Question;
