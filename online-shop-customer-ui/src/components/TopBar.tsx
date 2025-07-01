import { useNavigate } from 'react-router-dom';
import {ReactNode} from "react";

type Props = {
    email: string | null;
    customButtons?: ReactNode[];
};

export default function TopBar({ email, customButtons }: Props) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-6">
            {email && (
                <p className="text-gray-700">
                    Logged in as: <strong>{email}</strong>
                </p>
            )}
            <div className="flex items-center gap-2">
                {customButtons}
                <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => {
                        localStorage.removeItem('userEmail');
                        navigate('/');
                    }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
