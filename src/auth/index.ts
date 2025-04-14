import {loginUser} from "./actions/login.actions";
import {logout} from "../services/auth.service";
import {registerUser} from "./actions/register.actions";

export const server = {
    // Auth
    loginUser,
    logout,
    registerUser,
};