// hooks/queries/useVariant.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';
import { sortByName } from '../../utils/getData';

export const useVariant = () => {
  return useQuery(
    ['allVariant'],
    async () => {
      const res = await axios.get('/variant/all');
      return sortByName(res.data);
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
