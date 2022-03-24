import { MeetingHotelItem } from './hotelModel';

export interface MeetingManagerItem {
  id: number;
  title: string;
  description: string;
  content: string;
  price: number | string;

  areas: {
    code: string[];
    value: string;
  };
  address: string;

  sort: number;
  status: number;
  active_time: string;

  register_count: number;
  register_groups_count: number;
  register_start_time: string;
  register_end_time: string;
  register_status: 'future' | 'started' | 'end';

  // for form
  register_time: {
    register_start_time: string;
    register_end_time: string;
  }[];

  hotels: MeetingHotelItem[];

  created_at: string;
  updated_at: string;
}
