import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";
import {
  GetAllHotelsParams,
  SearchHotelsRequest,
  UpdateHotelRequest,
} from "@/types/hotel";

export const hotelService = {
  getAllHotels(params?: GetAllHotelsParams) {
    return REQUEST.get(ROUTES.HOTEL.GET_ALL, { params: params });
  },

  // GET hotel by MongoDB _id
  getHotelById(hotelId: string) {
    return REQUEST.get(ROUTES.HOTEL.GET_BY_ID.replace(":hotelId", hotelId));
  },

  // GET hotel by slug (used on detail page)
  getHotelBySlug(slug: string) {
    return REQUEST.get(ROUTES.HOTEL.GET_BY_SLUG.replace(":slug", slug));
  },

  // AI natural language search — POST with query string
  searchHotels(query: SearchHotelsRequest) {
    return REQUEST.post(ROUTES.HOTEL.SEARCH, { query });
  },

  // OWNER: create hotel
  createHotel(payload: FormData) {
    return REQUEST.post(ROUTES.HOTEL.CREATE, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // OWNER: update hotel
  updateHotel(payload: UpdateHotelRequest) {
    return REQUEST.patch(
      ROUTES.HOTEL.UPDATE.replace(":hotelId", payload.hotelId),
      payload.allowedChanges,
    );
  },

  // ADMIN: delete hotel
  deleteHotel(hotelId: string) {
    return REQUEST.delete(ROUTES.HOTEL.DELETE.replace(":hotelId", hotelId));
  },
};
