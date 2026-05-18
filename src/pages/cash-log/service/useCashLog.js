/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../contexts/MainContext';

export default function useCashLog() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['listCashLog'];
  const queryKeyExist = ['existCash'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/cash-balance-history', {
          params: {
            outletRef: ctm?.selectedOutlet,
            ...params,
          },
        });

        return data;
      },
      enabled: !!ctm?.selectedOutlet && !!params?.balanceRef,
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        '/cash-balance-history',
        payload,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );

      if (payload?.cashOut) {
        await axios.post(
          '/expense/',
          {
            date: new Date(),
            code: 8, // pengeluaran outlet
            description: payload.title,
            amount: payload.cashOut,
          },
          {
            params: {
              outletRef: ctm?.selectedOutlet,
            },
          }
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const closeCashier = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        '/cash-balance/close',
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
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/cash-balance-history/${id}`,
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
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, id],
      queryFn: async () => {
        const { data } = await axios.get(
          `/cash-balance-history/${id}`,
          {
            params: {
              outletRef: ctm?.selectedOutlet,
            },
          }
        );
        return data;
      },
      enabled: !!id && !!ctm?.selectedOutlet,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `/cash-balance-history/${id}`,
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
    list,
    getById,
    create,
    closeCashier,
    update,
    remove,
  };
}
