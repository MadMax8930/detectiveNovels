import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const useNovelList = () => {
   const { data, error, isLoading, mutate } = useSWR('/api/comment/listAll', fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return { data, error, isLoading, mutate };
};

export default useNovelList;