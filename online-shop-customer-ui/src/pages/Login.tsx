import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../output.css';
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');

        fetch(`${apiUrl}/customers/email/${email}`)
            .then((response) => {
                if (response.status === 404) {
                    return fetch(`${apiUrl}/customers`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            firstName: null,
                            lastName: null,
                            address: null
                        })
                    }).then((createResp) => {
                        if (createResp.ok) {
                            toast.success('Account created successfully!');
                            return;
                        } else {
                            throw new Error('Error creating account.');
                        }
                    });
                } else if (response.ok) {
                    return;
                } else {
                    throw new Error('Unexpected response.');
                }
            })
            .then(() => {
                localStorage.setItem('userEmail', email);
                navigate('/products');
            })
            .catch((err) => {
                console.error('Login error:', err);
                setError('Something went wrong. Please try again later.');
            });
    };


    return (
        <div className="flex justify-center bg-gray min-h-screen pt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 shadow-lg rounded-lg p-8 w-full max-w-lg"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
                    Login to Your Account
                </h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
