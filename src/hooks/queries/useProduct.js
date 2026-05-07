import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useProduct = (selectedOutlet, options = {}) => {
  return useQuery(
    ['allProduct', selectedOutlet],
    async () => {
      const res = await axios.get(`/product/all?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
