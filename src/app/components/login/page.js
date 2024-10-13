"use client";
import { useState } from "react";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [ref, setRef] = useState(""); // Store ref from the OTP response

  // Step 1: Request OTP
  const handleGetOtp = async () => {
    try {
      const response = await fetch(
        "https://your/api/send-otp-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: mobileNumber }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setIsOtpSent(true); // OTP sent successfully
        setRef(data.ref); // Save the ref for OTP verification
        console.log("OTP sent successfully, ref:", data.ref);
      } else {
        console.error("Failed to send OTP:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Step 2: Verify OTP and Login
  const handleLogin = async () => {
    try {
      const response = await fetch("https://your/api/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref, otp }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        console.log("Login successful");
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Login with OTP
          </h2>
          <label htmlFor="mobile" className="block text-gray-600 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-500 focus:outline-none"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
          <button
            onClick={handleGetOtp}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Get OTP
          </button>
        </div>

        {/* Conditionally render OTP input field */}
        {isOtpSent && (
          <div className="mt-6">
            <label htmlFor="otp" className="block text-gray-600 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-500 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Login
            </button>
          </div>
        )}

        {/* Forgot Password and Register Options */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => console.log("Forgot Password Clicked")} // Replace with actual navigation logic
            className="text-sm text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Forgot Password?
          </button>
          <button
            onClick={() => console.log("Register Clicked")} // Replace with actual navigation logic
            className="text-sm text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
