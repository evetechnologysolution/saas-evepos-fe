// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useGeneralSetting = (options = {}) => {
  return useQuery(
    ['generalSettings'],
    async () => {
      const res = await axios.get('/setting');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
