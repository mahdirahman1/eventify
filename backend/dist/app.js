"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const mongoose_1 = __importDefault(require("mongoose"));
const is_auth_1 = __importDefault(require("./middleware/is-auth"));
const user_1 = __importDefault(require("./models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./graphql/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.2rle2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.post("/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jid;
    if (!token) {
        return res.send({ ok: false, token: "" });
    }
    let decodedToken = null;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    }
    catch (err) {
        console.log(err);
        return res.send({ ok: false, token: "" });
    }
    if (!decodedToken) {
        return res.send({ ok: false, token: "" });
    }
    let user = yield user_1.default.findById(decodedToken.userId);
    if (!user) {
        return res.send({ ok: false, token: "" });
    }
    return res.send({
        ok: true,
        token: (0, auth_1.createAccessToken)({ id: user._id, username: user.username }),
        userId: user._id,
    });
}));
function startApolloServer(typeDefs, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                return {
                    req,
                    res,
                };
            }),
        });
        yield server.start();
        server.applyMiddleware({
            app,
            cors: {
                origin: ["http://localhost:3000", "https://studio.apollographql.com"],
                credentials: true,
            },
        });
    });
}
app.use(is_auth_1.default);
startApolloServer(schema_1.default, resolvers_1.default);
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("db connected");
    app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
})
    .catch((err) => {
    console.log(err);
});
