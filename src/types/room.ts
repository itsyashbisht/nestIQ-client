import { IHotelImage } from "@/types/hotel";

export type RoomType = "standard" | "deluxe" | "suite" | "villa";
export type BedType = "single" | "double" | "king" | "twin";

export interface IRoom {
  _id: string;
  hotelId: string;
  type: RoomType;
  name: string;
  description: string;
  capacity: number;
  bedType: BedType;
  pricePerNight: number;
  images: IHotelImage[];
  amenities: string[];
  totalRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomRequest {
  hotelId: string;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  totalRooms: number;
}

export interface CreateRoomResponse {
  _id: string;
  hotelId: string;
  type: RoomType;
  name: string;
  description: string;
  capacity: number;
  bedType: BedType;
  pricePerNight: number;
  images: IHotelImage[];
  amenities: string[];
  totalRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoomRequest {
  roomId: string;
  allowedChanges: CreateRoomRequest;
}

export interface AddRoomImagesRequest {
  roomId: string;
  filePaths: string[];
}

export interface RemoveRoomImagesRequest {
  roomId: string;
  publicId: string;
}
