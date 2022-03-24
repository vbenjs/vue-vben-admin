export interface MeetingRoom {
  name: string;
  num: number;
}

export interface MeetingHotelItem {
  id: number;
  name: string;
  content: string;

  areas: {
    code: string[];
    value: string;
  };
  address: string;

  sort: number;

  contact: string;
  phone: string;
  rooms: MeetingRoom[];

  thumb: string;

  created_at: string;
  updated_at: string;
}
