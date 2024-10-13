"use client";
import { useState } from "react";
import { useForm } from "react-hook-form"; // Import React Hook Form

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [ref, setRef] = useState(""); // Store ref from the OTP response
  const [isDialogOpen, setIsDialogOpen] = useState(false); // For opening the dialog box

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Request OTP
  const handleGetOtp = async () => {
    try {
      const response = await fetch(
        "https://your/api/register", // Update API URL for registration
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: mobileNumber }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setIsOtpSent(true); // OTP sent successfully
        setRef(data.ref); // Save the ref for OTP verification
      } else {
        console.error("Failed to send OTP:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Step 2: Verify OTP and open dialog for additional details
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("https://your/api/verify-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: ref, otp: otp }),
      });

      const data = await response.json();
      console.log(data);
      if (data) {
        localStorage.setItem("register_jwt", data.jwt);
        console.log("register successful");
        setIsDialogOpen(true); // Open the dialog box for additional user details
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
    }
  };

  // Step 3: Submit registration details
  const onSubmit = async (data) => {
    const token = localStorage.getItem("register_jwt");

    try {
      const response = await fetch("https://your/api/add-account-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);
      // if (responseData.jwt) {
      //   localStorage.setItem("jwt", responseData.jwt);
      //   console.log("Registration successful");
      // } else if (responseData.error) {
      //   console.error("Validation Errors:", responseData.error.details);  // Log error details
      // } else {
      //   console.error("Registration failed");
      // }
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Register with OTP
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
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Dialog box for additional registration details */}
        {isDialogOpen && (
          <div className="mt-6 bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Complete Registration
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="firstName" className="block text-gray-600 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("firstname", {
                  required: "First name is required",
                })}
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.firstname.message}
                </p>
              )}

              <label htmlFor="lastName" className="block text-gray-600 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("lastname", { required: "Last name is required" })}
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.lastname.message}
                </p>
              )}

              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.email.message}
                </p>
              )}

              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.password.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Register
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
