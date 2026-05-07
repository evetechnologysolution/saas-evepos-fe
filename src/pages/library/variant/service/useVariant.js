/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../../contexts/MainContext';

export default function useVariant() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['variants'];
  const queryKeyAll = ['allVariant'];
  const queryKeyProduct = ['allProduct'];

  const list = (params = {}) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/variant', {
          params: {
            outletRef: ctm?.selectedOutlet,
            ...params,
          },
        });

        return data;
      },
      enabled: !!ctm?.selectedOutlet,
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/variant', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
      queryClient.invalidateQueries(queryKeyProduct);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/variant/${id}`,
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
      queryClient.invalidateQueries(queryKeyAll);
      queryClient.invalidateQueries(queryKeyProduct);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, id],
      queryFn: async () => {
        const { data } = await axios.get(
          `/variant/${id}`,
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
        `/variant/${id}`,
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
      queryClient.invalidateQueries(queryKeyAll);
      queryClient.invalidateQueries(queryKeyProduct);
    },
  });

  return {
    list,
    getById,
    create,
    update,
    remove,
    queryKey,
  };
}
