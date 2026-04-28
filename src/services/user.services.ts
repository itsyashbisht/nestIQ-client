import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";
import { UpdateDetailsRequest } from "@/types/user";

export const userService = {
  getMe() {
    return REQUEST.get(ROUTES.USER.GET_ME);
  },

  updateDetails(payload: UpdateDetailsRequest) {
    return REQUEST.post(ROUTES.USER.UPDATE_DETAILS, payload);
  },

  getAllUsers() {
    return REQUEST.get(ROUTES.USER.GET_ALL_USERS);
  },

  updateRoleToOwner() {
    return REQUEST.get(ROUTES.USER.SET_OWNER);
  },
};
