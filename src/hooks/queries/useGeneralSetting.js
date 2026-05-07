import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useGeneralSetting = (selectedOutlet, options = {}) => {
  return useQuery(
    ['generalSettings', selectedOutlet],
    async () => {
      const res = await axios.get(`/setting?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
