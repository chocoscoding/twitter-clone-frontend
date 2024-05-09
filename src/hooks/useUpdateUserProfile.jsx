import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`${API_URL}/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("chocosxclone")}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      navigate(`/profile/${data.username}`);
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
