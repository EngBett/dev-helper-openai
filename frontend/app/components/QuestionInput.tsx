"use client";

interface QuestionInputProps {
    question: string;
    setQuestion: (value: string) => void;
    loading: boolean;
    onSubmit: () => void;
    onClear: () => void;
    disabledClear: boolean;
    validationError?: string;
}

export default function QuestionInput({
                                          question,
                                          setQuestion,
                                          loading,
                                          onSubmit,
                                          onClear,
                                          disabledClear,
                                          validationError
                                      }: QuestionInputProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-t-md mt-4">
            {validationError && (
                <p className="text-red-500 text-sm px-4 pt-1 pb-2">{validationError}</p>
            )}
            <textarea
                className="w-full resize-none border-none p-4 focus:outline-none text-gray-800"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                placeholder="Ask me something..."
            />
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-t border-gray-200 rounded-b-md">
                <button
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 ${loading || question.trim() === "" ? "cursor-not-allowed" : " cursor-pointer"}`}
                    onClick={onSubmit}
                    disabled={loading || question.trim() === ""}
                >
                    {loading ? "Thinking..." : "Ask"}
                </button>
                <div className="flex items-center space-x-3 text-gray-500">
                    <button
                        onClick={onClear}
                        disabled={loading || disabledClear}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            loading || disabledClear
                                ? "bg-red-100 text-red-400 cursor-not-allowed"
                                : "bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
                        }`}
                    >
                        Clear
                    </button>
                </div>
            </div>
            {!disabledClear && (<div className="flex items-center justify-between bg-gray-200 h-20"></div>)}
        </div>
    );
}