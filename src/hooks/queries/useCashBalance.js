import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useCashBalance = (selectedOutlet, options = {}) => {
  return useQuery(
    ['existCash', selectedOutlet],
    async () => {
      const res = await axios.get(`/cash-balance/exist?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
