// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useAllNotif = () => {
  return useQuery(
    ['allNotif'],
    async () => {
      const res = await axios.get('/notification/all');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
