import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useGeneralPerfume = (selectedOutlet, options = {}) => {
  return useQuery(
    ['generalPerfume', selectedOutlet],
    async () => {
      const res = await axios.get(`/variant/all?perfume=yes&outletRef=${selectedOutlet}`);
      return res.data?.[0];
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
