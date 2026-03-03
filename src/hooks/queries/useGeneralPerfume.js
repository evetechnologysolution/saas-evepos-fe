// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useGeneralPerfume = () => {
  return useQuery(
    ['generalPerfume'],
    async () => {
      const res = await axios.get('/variant?perfume=yes');
      return res.data?.[0];
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
