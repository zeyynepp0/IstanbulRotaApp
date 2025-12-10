// src/types/api.ts
export interface Location {
  lat: number;
  lon: number;
  name?: string;
  address?: string;
}

export interface TransitSegment {
  line: string;
  from_name: string;
  to_name: string;
  time_min: number;
  is_transfer: boolean;
}

export interface TransitInfo {
  total_min: number;
  walk_to_station_min: number;
  walk_from_station_min: number;
  in_vehicle_min: number;
  segments: TransitSegment[];
}

export interface ParkingInfo {
  name: string;
  ilce: string;
  lat: number;
  lon: number;
}

export interface ParkAndRideOption {
  parking: ParkingInfo;
  car_min: number;
  walk_dist_m: number;
  walk_min: number;
  transit: TransitInfo;
  total_min: number;
}

export interface TrafficBreak {
  distance_km: number | null;
  coord: [number, number] | null;
  address: string | null;
}

export interface PlanResponse {
  origin: Location;
  destination: Location;
  car_only_min: number;
  transit_only: TransitInfo;
  traffic_break: TrafficBreak;
  park_and_ride_options: ParkAndRideOption[];
}

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  address: string;
  type: string[];
}