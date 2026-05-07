import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useAllNotif = (selectedOutlet, options = {}) => {
  return useQuery(
    ['allNotif', selectedOutlet],
    async () => {
      const res = await axios.get(`/notification/all?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
