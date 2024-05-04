import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        Cookies.remove("chocosxclone");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52 h-screen">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <div className=" flex flex-col justify-between h-[inherit] pr-2">
          <ul className="flex flex-col gap-3 mt-4">
            <li className="flex justify-center md:justify-start">
              <Link
                to="/"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg md:rounded-full duration-300 py-4 md:py-2 pl-4 md:pl-2 pr-4 w-fit md:w-full cursor-pointer">
                <MdHomeFilled className="w-8 h-8" />
                <span className="text-lg hidden md:block">Home</span>
              </Link>
            </li>
            <li className="flex justify-center md:justify-start">
              <Link
                to="/notifications"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg md:rounded-full duration-300 py-4 md:py-2 pl-4 md:pl-2 pr-4 w-fit md:w-full cursor-pointer">
                <IoNotifications className="w-6 h-6" />
                <span className="text-lg hidden md:block">Notifications</span>
              </Link>
            </li>

            <li className="flex justify-center md:justify-start">
              <Link
                to={`/profile/${authUser?.username}`}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg md:rounded-full duration-300 py-4 md:py-2 pl-4 md:pl-2 pr-4 w-fit md:w-full cursor-pointer">
                <FaUser className="w-6 h-6" />
                <span className="text-lg hidden md:block">Profile</span>
              </Link>
            </li>
          </ul>

          {authUser && (
            <div className="mt-auto flex flex-col mb-4 gap-2">
              <button
                className="flex gap-2 items-center justify-center md:justify-between transition-all duration-300 hover:bg-[#181818] py-4 px-2 rounded-lg md:rounded-full w-full"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}>
                <span className="hidden md:block">Logout </span>
                <BiLogOut className="w-5 h-5 cursor-pointer" />
              </button>

              <Link
                to={`/profile/${authUser.username}`}
                className=" flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full">
                <div className="avatar hidden md:inline-flex">
                  <div className="w-8 rounded-full">
                    <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className="flex justify-between flex-1">
                  <div className="hidden md:block">
                    <p className="text-white font-bold text-sm w-20 truncate">{authUser?.fullName}</p>
                    <p className="text-slate-500 text-sm">@{authUser?.username}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
