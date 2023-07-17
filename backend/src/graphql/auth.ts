import jwt from "jsonwebtoken";
import "dotenv/config";

interface User {
	id: number;
	username: String;
}

export const createAccessToken = (user: User) => {
	return jwt.sign(
		{ userId: user.id, username: user.username },
		`${process.env.ACCESS_TOKEN_SECRET!}`,
		{
			expiresIn: "15m",
		}
	);
};

export const createRefreshToken = (user: User) => {
	return jwt.sign(
		{ userId: user.id, username: user.username },
		`${process.env.REFRESH_TOKEN_SECRET!}`,
		{
			expiresIn: "4d",
		}
	);
};
