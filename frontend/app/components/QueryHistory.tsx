import {useEffect, useRef} from "react";
import parse from 'html-react-parser';

interface QueryHistoryItem {
    question: string;
    answer: string;
    timestamp: string;
}

interface QueryHistoryProps {
    queries: QueryHistoryItem[];
    loading: boolean;
}

function formatTimestamp(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function QueryHistory({queries, loading}: QueryHistoryProps) {
    const bottomRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [queries]);

    return (
        <div className="mt-2 space-y-4">
            {loading ? (
                <p className="text-gray-600">
                    <svg aria-hidden="true" role="status"
                         className="inline w-4 h-4 me-3 text-gray-200 animate-spin"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"/>
                    </svg> Loading history...
                </p>
            ) : queries.length === 0 ? (
                <span></span>
            ) : (
                <ul className="space-y-4">
                    {queries.map((item, index) => (
                        <li
                            key={index}
                            ref={index === queries.length - 1 ? bottomRef : null}
                            className={`p-8 shadow-md rounded bg-gray-50 ${
                                index === queries.length - 1 ? "shadow-blue-300/50" : ""
                            }`}
                        >
                            <p className="text-sm text-gray-500 mb-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="feather feather-clock mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                {formatTimestamp(item.timestamp)}
                            </p>
                            <p className="font-semibold text-blue-700 mb-1 py-5">Question: {item.question}</p>
                            <p className="text-gray-800 whitespace-pre-wrap"><span className="text-lg">Answer</span>: {parse(item.answer)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
