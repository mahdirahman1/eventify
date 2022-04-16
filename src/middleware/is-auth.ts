import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: string;
}

export default (req: any, res: any, next: any) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(" ")[1]; //Bearer (token)
	if (!token || token === "") {
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "secret-shak") as JwtPayload;
	} catch {
		req.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}
	req.isAuth = true;
	req.userId = decodedToken.userId;
	next();
};
