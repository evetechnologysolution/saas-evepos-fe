// hooks/queries/useProduct.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useProduct = (options = {}) => {
  return useQuery(
    ['allProduct'],
    async () => {
      const res = await axios.get('/product/all');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
