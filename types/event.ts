export interface Event {
  id: string;
  title: string;
  date_time: string;
  location: string;
  latitude: number;
  longitude: number;
  created_at: string;
  user_id: string | null;
}
