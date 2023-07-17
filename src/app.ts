import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import mongoose from "mongoose";
import authMiddleware from "./middleware/is-auth";
import User from "./models/user";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { createAccessToken } from "./graphql/auth";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${
	process.env.MONGO_PASS
}@cluster0.2rle2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(
	cors({
		origin: ["https://studio.apollographql.com"],
		credentials: true,
	})
);
app.use(cookieParser());
app.post("/refresh_token", async (req, res) => {
	const token = req.cookies.jid;
	if (!token) {
		return res.send({ ok: false, token: "" });
	}

	let decodedToken = null;
	try {
		decodedToken = jwt.verify(
			token,
			`${process.env.ACCESS_TOKEN_SECRET}`
		) as JwtPayload;
	} catch (err) {
		console.log(err);
		return res.send({ ok: false, token: "" });
	}

	if (!decodedToken) {
		return res.send({ ok: false, token: "" });
	}
	let user = await User.findById(decodedToken.userId);
	if (!user) {
		return res.send({ ok: false, token: "" });
	}
	return res.send({
		ok: true,
		token: createAccessToken({ id: user._id, username: user.username }),
		userId: user._id,
	});
});

async function startApolloServer(typeDefs: any, resolvers: any) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req, res }: any) => {
			return {
				req,
				res,
			};
		},
	});

	await server.start();
	server.applyMiddleware({
		app,
		cors: {
			origin: ["https://studio.apollographql.com"],
			credentials: true,
		},
	});
}

app.use(authMiddleware);
startApolloServer(typeDefs, resolvers);

mongoose
	.connect(uri)
	.then(() => {
		console.log("db connected");
		app.listen({ port: process.env.PORT || 4000 }, () =>
			console.log(`🚀 Server ready at http://localhost:4000`)
		);
	})
	.catch((err) => {
		console.log(err);
	});
