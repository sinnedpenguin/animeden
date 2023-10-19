export const paths = {
  search: (query: string) => `${process.env.NEXT_PUBLIC_SEARCH_API_PATH}${encodeURIComponent(query)}`,
  info: (id: string) => `${process.env.NEXT_PUBLIC_INFO_API_PATH}${id}`,
  episode: (episodeId: string) => `${process.env.NEXT_PUBLIC_EPISODE_API_PATH}${episodeId}`,
  trending: process.env.NEXT_PUBLIC_TRENDING_API_PATH,
  popular: process.env.NEXT_PUBLIC_POPULAR_API_PATH,
  random: process.env.NEXT_PUBLIC_RANDOM_API_PATH,
}