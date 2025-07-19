import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onValidated: (isValid: boolean) => void;
  error?: string;
}

export default function Captcha({ onValidated, error }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isValid, setIsValid] = useState(false);

  const generateCaptcha = () => {
    const first = Math.floor(Math.random() * 10) + 1;
    const second = Math.floor(Math.random() * 10) + 1;
    setNum1(first);
    setNum2(second);
    setUserAnswer("");
    setIsValid(false);
    onValidated(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    const correctAnswer = num1 + num2;
    const isValidAnswer = parseInt(value) === correctAnswer;
    setIsValid(isValidAnswer);
    onValidated(isValidAnswer);
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
        Security Verification
      </label>
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono text-black dark:text-white">
            {num1} + {num2} = ?
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            title="Refresh CAPTCHA"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors placeholder-gray-500 dark:placeholder-slate-400"
          placeholder="Enter answer"
          required
        />
      </div>
      {userAnswer && !isValid && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          Incorrect answer. Please try again.
        </div>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 