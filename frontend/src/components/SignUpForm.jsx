import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast.warning("Please select an image");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "zuno-chat");
      data.append("cloud_name", "dxlh6mpda");

      fetch("https://api.cloudinary.com/v1_1/dxlh6mpda/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          toast.error("Image upload failed");
          setLoading(false);
        });
    } else {
      toast.error("Please select an image file (JPEG/PNG)");
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.warning("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/user`,
        { name, email, password, pic },
        config
      );

      toast.success("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error("Failed to register");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
    >
      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Password */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-xl text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </span>
      </div>

      {/* Confirm Password */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-xl text-gray-500"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
        >
          {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </span>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload your Picture
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md transition flex justify-center items-center gap-2 ${
          loading
            ? "bg-[#7e6f8f] cursor-not-allowed"
            : "bg-[#5e3a87] hover:bg-[#4b2f70] text-white"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
