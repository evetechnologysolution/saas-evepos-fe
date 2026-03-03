/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

const QUERY_KEY = ['categories'];
const QUERY_KEY_ALL = ['allCategory'];

export default function useCategory() {
  const queryClient = useQueryClient();

  /* =======================
   * LIST
   * ======================= */
  const list = (params = {}) =>
    useQuery({
      queryKey: [...QUERY_KEY, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/category?${qs}`);
        return data;
      },
      keepPreviousData: true,
      staleTime: 0, // selalu fresh setelah invalidate
      refetchOnWindowFocus: false,
    });

  /* =======================
   * CREATE
   * ======================= */
  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/category', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.invalidateQueries(QUERY_KEY_ALL);
    },
  });

  /* =======================
   * UPDATE
   * ======================= */
  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/category/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.invalidateQueries(QUERY_KEY_ALL);
    },
  });

  /* =======================
   * DELETE
   * ======================= */
  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/category/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.invalidateQueries(QUERY_KEY_ALL);
    },
  });

  /* =======================
   * DETAIL
   * ======================= */
  const getById = (id) =>
    useQuery({
      queryKey: [...QUERY_KEY, 'detail', id],
      queryFn: async () => {
        const { data } = await axios.get(`/category/${id}`);
        return data;
      },
      enabled: Boolean(id),
      staleTime: 5 * 60 * 1000,
    });

  return {
    list,
    getById,
    create,
    update,
    remove,
    queryKey: QUERY_KEY,
  };
}
