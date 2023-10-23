export const paths = {
  search: (query: string) => `${process.env.NEXT_PUBLIC_SEARCH_API_PATH}${encodeURIComponent(query)}`,
  info: (id: string) => `${process.env.NEXT_PUBLIC_INFO_API_PATH}${id}`,

  episode: (episodeId: string) => {
    const episodePath = episodeId.startsWith('/') ? episodeId : `/${episodeId}`;
    return `${process.env.NEXT_PUBLIC_EPISODE_API_PATH}${episodePath}`;
  },
  
  trending: process.env.NEXT_PUBLIC_TRENDING_API_PATH,
  popular: process.env.NEXT_PUBLIC_POPULAR_API_PATH,
  genre: (genre: string) => `${process.env.NEXT_PUBLIC_GENRE_API_PATH}["${decodeURIComponent(genre)}"]&`,
  random: process.env.NEXT_PUBLIC_RANDOM_API_PATH,
}