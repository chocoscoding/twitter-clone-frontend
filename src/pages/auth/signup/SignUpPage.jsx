import { Link } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [passVisibility, setPassVisibility] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");

        Cookies.set("chocosxclone", data.token, {
          expires: 15, // 15 days
          secure: import.meta.env.NODE_ENV !== "development",
          sameSite: "strict",
        });
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // page won't reload
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>

          <div className="flex flex-col gap-2">
            <p className="text-base">Email</p>
            <label className="input input-bordered rounded-lg flex items-center gap-2">
              <MdOutlineMail />
              <input type="email" className="grow" placeholder="Email" name="email" onChange={handleInputChange} value={formData.email} />
            </label>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-base">Username</p>
              <label className="input input-bordered rounded-lg flex items-center gap-2">
                <FaUser />
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  autoComplete="username"
                />
              </label>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-base">Full Name</p>
              <label className="input input-bordered rounded-lg flex items-center gap-2">
                <MdDriveFileRenameOutline />
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base flex items-center gap-2">
              Password
              <span className="cursor-pointer" onClick={() => setPassVisibility(!passVisibility)}>
                {passVisibility ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </p>
            <label className="input input-bordered rounded-lg flex items-center gap-2">
              <MdPassword />
              <input
                type={passVisibility ? "text" : "password"}
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                autoComplete="new-password"
              />
            </label>
          </div>

          <button className="btn rounded-full btn-primary text-white">{isPending ? "Loading..." : "Sign up"}</button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-gray-300 text-center mb-2">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
