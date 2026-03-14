// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useCategory = (options = {}) => {
  return useQuery(
    ['allCategory'],
    async () => {
      const res = await axios.get('/category/all');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
