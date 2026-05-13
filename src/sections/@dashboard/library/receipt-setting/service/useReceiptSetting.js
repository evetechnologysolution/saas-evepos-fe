/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../../../contexts/MainContext';

export default function useReceiptSetting() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['receiptHeader'];

  const getReceiptHeader = () =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet],
      queryFn: async () => {
        const { data } = await axios.get(
          '/receipt-setting',
          {
            params: {
              outletRef: ctm?.selectedOutlet,
            },
          }
        );
        return data;
      },
    });

  const update = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        '/receipt-setting',
        payload,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    getReceiptHeader,
    update,
  };
}
