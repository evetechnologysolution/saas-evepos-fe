/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../../contexts/MainContext';

const QUERY_KEY = ['categories'];
const QUERY_KEY_ALL = ['allCategory'];

export default function useCategory() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();

  /* =======================
   * LIST
   * ======================= */
  const list = (params = {}) =>
    useQuery({
      queryKey: [...QUERY_KEY, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/category', {
          params: {
            outletRef: ctm?.selectedOutlet,
            ...params,
          },
        });

        return data;
      },
      enabled: !!ctm?.selectedOutlet,
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
      const { data } = await axios.patch(
        `/category/${id}`,
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
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.invalidateQueries(QUERY_KEY_ALL);
    },
  });

  /* =======================
   * DELETE
   * ======================= */
  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `/category/${id}`,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );
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
      queryKey: [
        ...QUERY_KEY,
        ctm?.selectedOutlet,
        id,
      ],

      queryFn: async () => {
        const { data } = await axios.get(
          `/category/${id}`,
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

  return {
    list,
    getById,
    create,
    update,
    remove,
    queryKey: QUERY_KEY,
  };
}
