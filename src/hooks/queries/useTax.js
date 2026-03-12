import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useTax = (options = {}) => {
  return useQuery(
    ['taxSetting'],
    async () => {
      const res = await axios.get('/tax');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
