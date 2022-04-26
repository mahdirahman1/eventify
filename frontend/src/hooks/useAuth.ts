import { useSelector } from "react-redux";
import { authState } from "../store/AuthReducer";

interface IAuthRed {
	Auth: authState;
}

const useAuth = () => {
	const data = useSelector((state: IAuthRed) => state.Auth);
	const { userId, token } = data;

    return {loggedIn: userId ? true : false, userId, token}
};

export default useAuth;
