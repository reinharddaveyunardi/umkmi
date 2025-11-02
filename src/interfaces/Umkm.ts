export interface NewUMKM {
  id: number;
  name: string;
  rating: number;
  rangePrice: { min: number; max: number };
  location: {
    lat: number;
    long: number;
    name: string;
  };
  thumbnail: string;
  servicesOption: string[];
  albums: string[];
  status: any;
}

export interface FlattenedUMKM {
  id: string;
  name: string;
  lat: number;
  lon: number;
  thumbnailUrl: string;
  rating?: number;
  distance?: number;
  description?: string;
}

export interface NearbyUMKM extends FlattenedUMKM {
  distance: number;
}

export interface DayStatus {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface Status {
  time: Record<string, DayStatus>;
}

export interface baseUmkm {
  id: number;
  name: string;
  rating: number;
  status: string;
  thumbnail: string;
  location: {
    lat: number;
    long: number;
  };
  address: string;
  user_ratings_total: number;
  types: string[];
}

export interface detailUmkm extends baseUmkm {
  review: {
    rating: number;
    text: string;
  };
}

export interface umkmDetails {
  id: string;
  name: string;
  rating: string;
  address: string;
  location: {
    lat: number;
    long: number;
  };
  thumbnail: string;
  albums: string[];
  opening_hours: {
    open_now: boolean;
    periods: {
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }[];
  };
  phone_number: string;
  dine_in: boolean;
  take_away: boolean;
  reviews: review[];
  user_ratings_total: number;
}

export interface review {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  relative_time_description: string;
  text: string;
  time: number;
  rating: number;
}
