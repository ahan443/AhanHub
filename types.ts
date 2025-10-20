
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation?: string;
  revelationType?: string;
  numberOfAyahs?: number;
  audioUrl: string;
}

export interface Episode {
  number: number;
  title: string;
  videoUrl: string;
  synopsis?: string;
}

export interface Anime {
  id: number;
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
  id: number;
  name: string;
  genre: string;
  tracks: RadioTrack[];
}