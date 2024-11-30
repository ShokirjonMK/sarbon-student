import { InformerDRDT } from "models/base";
import { UseQueryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { CLIENT_API } from "services/client.request";

const useGetData = <T = any>({ queryKey, url, options, urlParams }: { queryKey: string[], url: string, options?: UseQueryOptions<InformerDRDT<T>>, urlParams?: Record<string | number, any> }) => {

    const queryClient = useQueryClient();

    const response = useQuery<InformerDRDT<T>>({
        queryKey,
        queryFn: () => CLIENT_API.getAll({ url, _params: urlParams }),
        ...options
    });

    if (!response.data && !response.isLoading && !response.error) {
        queryClient.prefetchQuery(queryKey, () => CLIENT_API.getAll({ url, _params: urlParams }));
    }

    return { ...response }
}



export default useGetData;