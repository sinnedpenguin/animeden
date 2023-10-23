import { paths } from "@/config/api";

interface AnimeProviders {
  [key: string]: string;
}

const AnimeProviders: AnimeProviders = {
  ANIMEPAHE: "animepahe",
  GOGO: "gogoanime",
  ZORO: "zoro",
  ENIME: "enime",
  CRUNCHYROLL: "crunchyroll",
};

interface AnimeSearchParams {
  page: number;
  perPage: number;
}

export class AnimeApi {
  private host = process.env.NEXT_PUBLIC_API_HOST;
  private provider: string;

  constructor(provider = "GOGO") {
    this.provider = AnimeProviders[provider];
  }

  [key: string]: any; 

  private async consumeApiGetCall<T>(path = "", params = {}): Promise<T> {
    const url = `${this.host}${path.startsWith("/") ? path : `/${path}`}`;
    try {
      const response = await fetch(url + "?" + new URLSearchParams({ provider: this.provider, ...params }));

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(query: string, page = 1, perPage = 30): Promise<any> {
    const path = paths.search(query);
    const params: AnimeSearchParams = { page, perPage };
    return this.consumeApiGetCall(path, params);
  }

  async getInfo(id: string): Promise<any> {
    const path = paths.info(id);
    return this.consumeApiGetCall(path);
  }

  async getEpisode(episodeId: string): Promise<any> {
    const path = paths.episode(episodeId);
    return this.consumeApiGetCall(path);
  }

  async getTrending(params = {}): Promise<any> {
    return this.consumeApiGetCall(paths.trending, {
      ...params,
    });
  }

  async getPopular(params = {}): Promise<any> {
    return this.consumeApiGetCall(paths.popular, {
      ...params,
    });
  }

  async getByGenre(genre: string, params = {}): Promise<any> {
    const path = paths.genre(genre);
    return this.consumeApiGetCall(path, params);
  }

  async getRandom(params = {}): Promise<any> {
    return this.consumeApiGetCall(paths.random, {
      ...params,
    });
  }
}

export const animeApi = new AnimeApi();