import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useTax = (selectedOutlet, options = {}) => {
  return useQuery(
    ['taxSetting', selectedOutlet],
    async () => {
      const res = await axios.get(`/tax?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
