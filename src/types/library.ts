export interface RpgMetadata {
  tags: string[];
  terrain_type: string[];
  difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'HARD';
  quest_time_minutes: number;
  recommended_season: string;
}

export interface SocialStats {
  mana_likes: number;
  views: number;
}

export interface Article {
  guide_id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  cover_image_url: string;
  rpg_metadata: RpgMetadata;
  social: SocialStats;
  published_at: string;
}

export interface LibraryResponse {
  success: boolean;
  data: Article[];
}