import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProfileStore = create((set, get) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  calendarData: [],  
  calendarYear: new Date().getFullYear(),
  isCalendarLoading: false,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/profile/dashboard");
      set({ dashboardData: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to fetch dashboard data");
    }
  },

    fetchCalendarData: async (year = new Date().getFullYear()) => {
    set({ isCalendarLoading: true });
    try {
      const response = await axiosInstance.get(`/profile/calendar/${year}`);
      set({ 
        calendarData: response.data.data,
        calendarYear: year,
        isCalendarLoading: false 
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      set({ isCalendarLoading: false });
      toast.error("Failed to fetch calendar data");
      return [];
    }
  },

    changeCalendarYear: (year) => {
    get().fetchCalendarData(year);
  },

  initializeProfile: async () => {
    try {
      await axiosInstance.post("/profile/initialize");
      toast.success("Profile initialized successfully");
      get().fetchDashboard();
      get().fetchCalendarData();
    } catch (error) {
      console.error("Error initializing profile:", error);
      if (error.response?.status !== 400) {
        toast.error("Failed to initialize profile");
      }
    }
  },

  refreshDashboard: () => {
    get().fetchDashboard();
    get().fetchCalendarData(get().calendarYear);
  },
}));