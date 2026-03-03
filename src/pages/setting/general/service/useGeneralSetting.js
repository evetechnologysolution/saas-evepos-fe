/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useGeneralSetting() {
  const queryClient = useQueryClient();
  const queryKey = ['generalSettings'];

  const getDataSetting = () =>
    useQuery({
      queryKey,
      queryFn: async () => {
        const { data } = await axios.get('/setting');
        return data;
      },
    });

  const update = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/setting', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    getDataSetting,
    update,
  };
}
