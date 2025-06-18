"use client"

import { useState, useEffect } from "react"

export default function VerificationPage() {
  const [code, setCode] = useState(["", "", "", ""])  // Store the 4 code digits
  const [timeLeft, setTimeLeft] = useState(60)  // Timer for the "Send code again"
  const [isSending, setIsSending] = useState(false)  // For enabling/disabling button when sending code

  // Handle input changes and update the respective digit
  const handleCodeChange = (e, index) => {
    let value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers

    setCode(prevCode => {
      const newCode = [...prevCode];
      newCode[index] = value;
      return newCode;
    });
  }

  // Countdown for the "Send code again" button
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Function for resending code
  const resendCode = () => {
    setIsSending(true);
    // Reset the timer
    setTimeLeft(60);
    setTimeout(() => {
      setIsSending(false);
      alert("Code has been sent again!");
    }, 2000);  // Simulate a network delay
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeEntered = code.join("");
    alert(`Verification code submitted: ${codeEntered}`);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-10">
      {/* Title */}
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Please Check your Email</h1>
      
      <p className="text-center text-gray-600 mb-6">We have sent the code to your email.</p>

      {/* Verification code input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="flex justify-center space-x-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(e, index)}
              className="w-12 h-12 text-xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        {/* Send code again link with countdown */}
        <div className="text-center">
          <button
            type="button"
            onClick={resendCode}
            className={`text-sm ${isSending ? "text-gray-400" : "text-green-600"} hover:text-green-700`}
            disabled={isSending}
          >
            {isSending ? `Send code again ${timeLeft}s` : "Send code again"}
          </button>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
          >
            Verification
          </button>
        </div>
      </form>
    </div>
  )
}
