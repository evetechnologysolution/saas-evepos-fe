import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useSubcategory = (selectedOutlet, options = {}) => {
  return useQuery(
    ['allSubcategory', selectedOutlet],
    async () => {
      const res = await axios.get(`/subcategory/all?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
