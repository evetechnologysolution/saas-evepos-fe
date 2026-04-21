// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useGlobalDisc = () => {
  return useQuery(
    ['globalDisc'],
    async () => {
      const res = await axios.get('/discount');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
