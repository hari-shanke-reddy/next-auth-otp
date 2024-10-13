"use client";
import { useState } from "react";
import { useForm } from "react-hook-form"; // Import React Hook Form

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [ref, setRef] = useState(""); // Store the ref from the API response

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Submit mobile number (identifier) to forgot password API
  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://your-api-forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: data.identifier, // Send identifier (e.g. mobile number)
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage("A password reset OTP has been sent to your mobile.");
        setIsOtpDialogOpen(true); // Open OTP dialog box
        setRef(responseData.ref); // Save ref to be used for password reset
      } else {
        setErrorMessage(responseData.message || "Failed to send reset link.");
      }
    } catch (error) {
      setErrorMessage("Error sending reset link.");
    }
  };

  // Step 2: Reset password with OTP and new password
  const onResetPassword = async (resetData) => {
    try {
      const response = await fetch(
        "https:your-reset-password-api", // Update to your reset-password endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: ref, // Pass the ref received from the first request
            otp: resetData.otp,
            password: resetData.password,
            passwordConfirmation: resetData.passwordConfirmation,
          }),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully. You can now log in.");
        setIsOtpDialogOpen(false); // Close the dialog after successful password reset
      } else {
        setErrorMessage(responseData.message || "Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage("Error during password reset.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="identifier" className="block text-gray-600 mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            id="identifier"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-500 focus:outline-none"
            {...register("identifier", { required: true })}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mb-2">
              Mobile number is required
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        {/* Success or error message */}
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}

        {/* OTP and Reset Password Dialog */}
        {isOtpDialogOpen && (
          <div className="mt-6 bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Reset Your Password
            </h3>
            <form onSubmit={handleSubmit(onResetPassword)}>
              <label htmlFor="otp" className="block text-gray-600 mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("otp", { required: true })}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mb-2">OTP is required</p>
              )}

              <label htmlFor="password" className="block text-gray-600 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-2">
                  Password is required
                </p>
              )}

              <label
                htmlFor="passwordConfirmation"
                className="block text-gray-600 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("passwordConfirmation", { required: true })}
              />
              {errors.passwordConfirmation && (
                <p className="text-red-500 text-sm mb-2">
                  Password confirmation is required
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Reset Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
