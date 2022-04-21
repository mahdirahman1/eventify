import { AnyAction } from "redux";

const initialState = {
	userId: "",
	token: "",
};

const AuthReducer = (state = initialState, action: AnyAction) => {
	switch (action.type) {
		case "LOGIN_USER":
			state = action.payload;
			break;

		default:
			return state;
	}
	return state;
};

export default AuthReducer;
