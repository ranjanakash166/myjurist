import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-2 sm:space-y-3">
      <Label
        htmlFor="captcha"
        className="font-medium"
        style={{ color: "var(--text-primary, #0f172a)" }}
      >
        Security Verification
      </Label>
      <Card className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span
                className="text-base sm:text-lg font-mono font-medium"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                {num1} + {num2} = ?
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="p-1.5 sm:p-1 h-auto text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                title="Refresh CAPTCHA"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <Input
              type="number"
              id="captcha"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full sm:flex-1 border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-500 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb]"
              placeholder="Enter answer"
              required
            />
          </div>
        </CardContent>
      </Card>
      {userAnswer && !isValid && (
        <p className="text-sm font-medium text-destructive">
          Incorrect answer. Please try again.
        </p>
      )}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
} 