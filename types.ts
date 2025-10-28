
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation?: string;
  revelationType?: string;
  numberOfAyahs?: number;
  audioUrl: string;
  description?: string;
}

export interface Episode {
  number: number;
  title: string;
  videoUrl: string;
  synopsis?: string;
}

export interface Anime {
  id: string;
  title: string;
  imageUrl: string;
  synopsis: string;
  episodes: Episode[];
}

export interface RadioTrack {
  title: string;
  artist: string;
  audioUrl: string;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  tracks: RadioTrack[];
}

export interface LiveTvChannel {
  id: string;
  name: string;
  logoUrl: string;
  streamUrl: string;
  category: string;
  type?: 'embed' | 'hls';
}