// src/pages/Question.jsx

import { useState } from "react";
import api from "../api/api"; // <-- IMPORT our new instance

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
                // Use 'api' and a relative path
                await api.post(
                    `/api/room/${roomCode}/question`,
                    { content: question }
                );

                setQuestion("");
                setErrors({});
            } catch (error) {
                console.error(error);
                setErrors({ message: "Error posting question, please try again" });
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Ask a Question</h2>

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
                    Submit Question
                </button>

                {errors.message && (
                    <p className="text-red-600 text-center text-sm mt-4">{errors.message}</p>
                )}
            </div>
        </div>
    );
}

export default Question;