export interface NewUMKM {
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
  name: string;
  lat: number;
  lon: number;
  thumbnailUrl: string;
}

export interface NearbyUMKM extends FlattenedUMKM {
  distance: number;
}
