import { useQuery } from 'react-query';
import axios from '../../utils/axios';
import { sortByName } from '../../utils/getData';

export const useVariant = (selectedOutlet, options = {}) => {
  return useQuery(
    ['allVariant', selectedOutlet],
    async () => {
      const res = await axios.get(`/variant/all?perfume=no&outletRef=${selectedOutlet}`);
      return sortByName(res.data);
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
