import REQUEST from "@/lib/axios";
import ROUTES from '../constants/routes.json';
import {
    ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest,
} from '@/types/auth';

export const authService = {
    register(payload: RegisterRequest) {
        return REQUEST.post(ROUTES.USER.REGISTER, payload);
    },

    login(payload: LoginRequest) {
        return REQUEST.post(ROUTES.USER.LOGIN, payload);
    },

    logout() {
        return REQUEST.post(ROUTES.USER.LOGOUT);
    },

    changePassword(payload: ChangePasswordRequest) {
        return REQUEST.post(ROUTES.USER.CHANGE_PASSWORD, payload);
    },

    forgotPassword(payload: ForgotPasswordRequest) {
        return REQUEST.post(ROUTES.USER.FORGOT_PASSWORD, payload);
    },
};
