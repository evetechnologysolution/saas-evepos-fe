import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useCategory = (selectedOutlet, options = {}) => {
  return useQuery(
    ['allCategory', selectedOutlet],
    async () => {
      const res = await axios.get(`/category/all?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
