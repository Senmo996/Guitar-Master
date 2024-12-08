export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  specialTuning?: string;
  thumbnailUrl?: string;
  sheetMusicImages: string[]; // Array of base64 encoded sheet music images
  tabContent?: string;
  tabFile?: {
    url: string;
    type: 'pdf' | 'image';
  };
  lastPlayed?: Date;
  dateAdded: Date;
  totalPracticeTime: number; // Total practice time in seconds
}

export interface TunerNote {
  string: number;
  note: string;
  frequency: number;
  isInTune: boolean;
}

export interface TabFilter {
  searchQuery?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  specialTuning?: string;
  sortBy: 'dateAdded' | 'lastPlayed' | 'title';
}

export interface NewSong {
  title: string;
  artist: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  specialTuning?: string;
  thumbnailUrl?: string;
  sheetMusicImages: string[]; // Array of base64 encoded sheet music images
  tabContent?: string;
  tabFile?: {
    url: string;
    type: 'pdf' | 'image';
  };
  totalPracticeTime: number; // Total practice time in seconds
}