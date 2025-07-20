import axios from 'axios';
import type { UserProfileDTO } from '../types/UserProfileDTO';
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";

export const fetchProfile = async (id64: string): Promise<UserProfileDTO> => {
  const response = await axios.get(`${baseUrl}/profile/${id64}`);
  return response.data;
};