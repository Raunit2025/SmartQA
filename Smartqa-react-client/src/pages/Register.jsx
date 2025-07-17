import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message); // Or use a toast notification component
        }
        if (isSuccess || user) {
            navigate('/');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { name, email, password };
        dispatch(register(userData));
    };

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <input
                            type="text" name="name" value={name} onChange={onChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg" required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email" name="email" value={email} onChange={onChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg" required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password" name="password" value={password} onChange={onChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-lg" required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">
                        Register
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;