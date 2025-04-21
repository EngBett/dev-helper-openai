"use client";

import {useState, useEffect, useRef} from "react";
import QueryHistory from "@/app/components/QueryHistory";
import QuestionInput from "@/app/components/QuestionInput";
import Swal from "sweetalert2";

interface QueryHistoryItem {
    question: string;
    answer: string;
    timestamp: string;
}

export default function Home() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState("");

    const [history, setHistory] = useState<QueryHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const bottomRef = useRef<HTMLDivElement>(null);
    const isHistoryEmpty = history.length === 0;

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"});
        }
    };

    const getSessionId = () => {
        let sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
            sessionId = crypto.randomUUID(); // Generate a new session ID if not present
            localStorage.setItem("session_id", sessionId);
        }
        return sessionId;
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const sessionId = getSessionId();
            const res = await fetch(`${API_BASE_URL}/history`, {
                credentials: "include",
                headers: {
                    "X-Session-ID": sessionId, // Pass session ID in headers
                },
            });
            const data = await res.json();

            console.log("Raw history data from API:", data);

            if (Array.isArray(data.queries)) {
                setHistory(data.queries);
                setTimeout(() => scrollToBottom(), 100);
            } else {
                console.warn("Unexpected response format. Setting history to empty array.");
                setHistory([]);
            }
        } catch (err) {
            console.error("Error fetching history:", err);
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const askQuestion = async () => {
        if (!question.trim()) {
            setValidationError("Please enter a question before submitting.");
            return;
        }

        setLoading(true);
        setValidationError("");
        setResponse("");

        try {
            const sessionId = getSessionId();
            const res = await fetch(`${API_BASE_URL}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-ID": sessionId, // Pass session ID in headers
                },
                body: JSON.stringify({question}),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (
                    res.status === 422 &&
                    Array.isArray(errorData.detail) &&
                    errorData.detail[0]?.msg
                ) {
                    setValidationError(errorData.detail[0].msg);
                } else {
                    setValidationError("Something went wrong. Please try again.");
                }

                setLoading(false);
                return;
            }

            const data = await res.json();
            setResponse(data.response);
            setQuestion("");
            await fetchHistory();
            console.debug(response);
        } catch (err) {
            console.error("Error asking question:", err);
            setValidationError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        const result = await Swal.fire({
            title: "Clear history?",
            text: "This will delete all your previous queries. Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, clear it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const sessionId = getSessionId();
                await fetch(`${API_BASE_URL}/clear-history`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "X-Session-ID": sessionId, // Pass session ID in headers
                    },
                });
                setHistory([]);
                setResponse("");
                await Swal.fire("Cleared!", "Your query history has been deleted.", "success");
            } catch (err) {
                console.error("Failed to clear history", err);
                await Swal.fire("Error", "Something went wrong while clearing history.", "error");
            }
        }
    };

    return (
        <main className="min-h-screen bg-gray-200 p-4 sm:p-6 relative">
            {/* Centered content area */}
            <div className="w-full max-w-screen-lg mx-auto pt-6 pb-[140px] px-4 mb-30">
                <QueryHistory queries={history} loading={loadingHistory}/>

                {/* Spacer to scroll to */}
                <div ref={bottomRef} className="h-4"/>
            </div>

            {/* Fixed input at bottom or center if no history */}
            <div
                className={`z-20 w-full max-w-screen-lg px-4 transition-all duration-200 ${
                    isHistoryEmpty
                        ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        : "fixed bottom-0 left-1/2 transform -translate-x-1/2"
                }`}
            >
                <QuestionInput
                    question={question}
                    setQuestion={(value) => {
                        setQuestion(value);
                        if (validationError) setValidationError("");
                    }}
                    loading={loading}
                    onSubmit={askQuestion}
                    onClear={clearHistory}
                    disabledClear={isHistoryEmpty}
                    validationError={validationError}
                />
            </div>
        </main>
    );
}