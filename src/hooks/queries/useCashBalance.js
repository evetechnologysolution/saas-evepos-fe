// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useCashBalance = () => {
  return useQuery(
    ['existCash'],
    async () => {
      const res = await axios.get('/cash-balance/exist');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
