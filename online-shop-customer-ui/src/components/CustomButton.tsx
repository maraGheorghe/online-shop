import {ReactNode} from "react";

type Props = {
    onClick?: () => void;
    children?: ReactNode;
};

export default function CustomButton({onClick, children}: Props) {
    return (
        <button
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
