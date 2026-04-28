import {
  AddRoomImagesRequest,
  CreateRoomRequest,
  RemoveRoomImagesRequest,
  UpdateRoomRequest,
} from "@/types/room";
import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";

export const roomServices = {
  createRoom: (payload: CreateRoomRequest) => {
    return REQUEST.post(ROUTES.ROOM.CREATE, payload);
  },
  deleteRoom: (roomId: string) => {
    return REQUEST.post(ROUTES.ROOM.DELETE.replace(":roomId", roomId));
  },
  getRoomById: (roomId: string) => {
    return REQUEST.get(ROUTES.ROOM.GET_BY_ID.replace(":roomId", roomId));
  },
  getRoomByHotel: (hotelId: string) => {
    return REQUEST.get(ROUTES.ROOM.GET_BY_HOTEL.replace(":hotelId", hotelId));
  },
  toggleRoomAvailability: (roomId: string) => {
    return REQUEST.put(
      ROUTES.ROOM.TOGGLE_ROOM_AVAILABILITY.replace(":roomId", roomId),
    );
  },
  updateRoom: (payload: UpdateRoomRequest) => {
    return REQUEST.patch(
      ROUTES.ROOM.UPDATE.replace(":roomId", payload.roomId),
      payload?.allowedChanges,
    );
  },
  addImages: (payload: AddRoomImagesRequest) => {
    return REQUEST.post(
      ROUTES.ROOM.ADD_IMAGES.replace(":roomId", payload.roomId),
      payload?.filePaths,
    );
  },
  removeImages: (payload: RemoveRoomImagesRequest) => {
    return REQUEST.delete(
      ROUTES.ROOM.REMOVE_IMAGES.replace(":roomId", payload.roomId),
      // @ts-ignore
      payload?.publicId,
    );
  },
};
