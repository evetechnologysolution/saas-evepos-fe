/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useService() {
  const queryClient = useQueryClient();
  const queryKeySubs = ['listSubscription'];
  const queryKey = ['listInvoice'];

  const listSubs = (params) =>
    useQuery({
      queryKey: [...queryKeySubs, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/subscription/tenant?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/invoice/tenant?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/invoice/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/invoice/tenant', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/invoice/tenant/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/invoice/tenant/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    queryKey,
    queryKeySubs,
    listSubs,
    list,
    getById,
    create,
    update,
    remove,
  };
}
