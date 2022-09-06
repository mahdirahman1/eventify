let accessToken = "";

export const getJwtToken = () => {
	return accessToken;
};

export const setJwtToken = (token: string) => {
	accessToken = token;
};
