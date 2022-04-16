import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import mongoose from "mongoose";
import authMiddleware from "./middleware/is-auth";

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${
	process.env.MONGO_PASS
}@cluster0.2rle2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

async function startApolloServer(typeDefs: any, resolvers: any) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req, res }: any) => {
			const isAuth = req.isAuth;
			const userId = req.userId;

			return {
				isAuth,
				userId,
			};
		},
	});

	await server.start();
	server.applyMiddleware({ app });
}

app.use(authMiddleware);
startApolloServer(typeDefs, resolvers);

mongoose
	.connect(uri)
	.then(() => {
		console.log("db connected");
		app.listen({ port: 4000 }, () =>
			console.log(`🚀 Server ready at http://localhost:4000`)
		);
	})
	.catch((err) => {
		console.log(err);
	});
