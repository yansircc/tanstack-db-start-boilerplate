import { QueryClient } from "@tanstack/react-query";

// 全局 QueryClient 实例，供 collections 使用
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 分钟
			refetchOnWindowFocus: false,
		},
	},
});
