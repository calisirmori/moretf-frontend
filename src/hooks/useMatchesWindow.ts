import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";
export function useMatchesWindow() {
  return useQuery({
    queryKey: ["matchesWindow"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/matches/window`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30 // ✅ in v4, use gcTime instead of cacheTime
  });
}

