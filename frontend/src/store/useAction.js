import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useActions = create((set) => ({
  isDeletingProblem: false,
  isUpdatingProblem: false,

  onDeleteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error("Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },

  onUpdateProblem: async (id, updatedData) => {
    try {
      set({ isUpdatingProblem: true });
      const res = await axiosInstance.put(`/problems/update-problem/${id}`, updatedData);
      toast.success("Problem updated successfully!");
      return res.data;
    } catch (error) {
      console.log("Error updating problem", error);
      toast.error("Error updating problem");
      throw error;
    } finally {
      set({ isUpdatingProblem: false });
    }
  },
}));