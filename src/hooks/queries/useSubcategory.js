// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useSubcategory = () => {
  return useQuery(
    ['allSubcategory'],
    async () => {
      const res = await axios.get('/subcategory/all');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
