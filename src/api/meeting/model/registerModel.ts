import { MeetingHotelItem } from './hotelModel';
import type { MeetingManagerItem } from './managerModel';
import type { MeetingUserType } from './userTypeModel';

export interface MeetingRegisterGroup {
  id: number;
  name: string;
  phone: string;
  telephone?: string;
  company: string;
  email: string;
  job: string;
  weixin?: string;
}

export interface MeetingRegisterHotel {
  id: number;
  hotel: MeetingHotelItem;
  start_time: string;
  end_time: string;
  rooms: MeetingHotelItem['rooms'];
  user_id: number;
  meeting_hotel_id: number;
  meeting_manager_id: number;
  meeting_register_id: number;
}
export interface MeetingRegisterItem extends MeetingRegisterGroup {
  id: number;

  user_id: number;

  meeting_manager: MeetingManagerItem;
  meeting_manager_id: number;

  user_type: MeetingUserType;
  meeting_user_type_id: number;

  status: number;

  register_groups_count: number;
  hotels_count: number;

  register_groups: MeetingRegisterGroup[];

  hotels: MeetingRegisterHotel[];

  // 账单
  bill_file: string;
  bill_number: string;
}
