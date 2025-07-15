import axios from 'axios';
import type { UserProfileDTO } from '../types/UserProfileDTO';

export const fetchProfile = async (id64: string): Promise<UserProfileDTO> => {
  const response = await axios.get(`https://api.more.tf/profile/${id64}`);
  return response.data;
};