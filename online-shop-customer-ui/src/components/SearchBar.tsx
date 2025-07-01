import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
    return (
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 mb-4 w-full max-w-md bg-white shadow-sm">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
            <input
                type="text"
                placeholder="Search products..."
                className="outline-none flex-grow focus:border-transparent"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
