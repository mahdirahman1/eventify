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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const event_1 = __importDefault(require("../models/event"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("./auth");
const resolvers = {
    Query: {
        events: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const events = yield event_1.default.find()
                    .populate({
                    path: "host",
                    populate: {
                        path: "hostedEvents",
                    },
                })
                    .populate("participants");
                return events.map((event) => {
                    return Object.assign(Object.assign({}, event._doc), { _id: event.id, date: new Date(event._doc.date).toISOString() });
                });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        editEvent: (_, { id }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                const events = yield event_1.default.find({ _id: id })
                    .populate({
                    path: "host",
                    populate: {
                        path: "hostedEvents",
                    },
                })
                    .populate("participants");
                const foundEvent = events[0];
                if (userId != foundEvent.host._id.toString()) {
                    throw new Error("Unauthorized");
                }
                return Object.assign(Object.assign({}, foundEvent._doc), { _id: foundEvent._doc._id.toString(), date: new Date(foundEvent._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        deleteEvent: (_, { id }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                const events = yield event_1.default.find({ _id: id })
                    .populate({
                    path: "host",
                    populate: {
                        path: "hostedEvents",
                    },
                })
                    .populate("participants");
                const foundEvent = events[0];
                if (!foundEvent) {
                    throw new Error("Event not found");
                }
                if (userId != foundEvent.host._id.toString()) {
                    throw new Error("Unauthorized");
                }
                yield event_1.default.deleteOne({ _id: id });
                return Object.assign(Object.assign({}, foundEvent._doc), { _id: foundEvent._doc._id.toString(), date: new Date(foundEvent._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        event: (_, { id }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                const events = yield event_1.default.find({ _id: id })
                    .populate({
                    path: "host",
                    populate: {
                        path: "hostedEvents",
                    },
                })
                    .populate("participants");
                const foundEvent = events[0];
                return Object.assign(Object.assign({}, foundEvent._doc), { _id: foundEvent._doc._id.toString(), date: new Date(foundEvent._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        user: (_, { id }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                let user = yield user_1.default.findById(id).populate({
                    path: "hostedEvents",
                    populate: { path: "host" },
                });
                const hostedEvents = user._doc.hostedEvents.map((event) => {
                    return Object.assign(Object.assign({}, event._doc), { date: new Date(event.date).toISOString() });
                });
                return Object.assign(Object.assign({}, user._doc), { _id: user._doc._id.toString(), hostedEvents });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        login: (_, { username, password }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let user = yield user_1.default.findOne({ username });
                if (!user) {
                    throw new Error("User does not exist");
                }
                const authenticated = yield bcryptjs_1.default.compare(password, user.password);
                if (!authenticated) {
                    throw new Error("Invalid validation");
                }
                const token = (0, auth_1.createAccessToken)(user);
                res.cookie("jid", (0, auth_1.createRefreshToken)(user), {
                    httpOnly: true,
                });
                return { userId: user.id, token, tokenExp: 1 };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        logout: (_, __, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            res.clearCookie("jid");
            return { success: true };
        }),
    },
    Mutation: {
        createEvent: (_, { event }, { req }, info) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                const newEvent = new event_1.default(Object.assign(Object.assign({}, event), { date: new Date(event.date).toISOString(), host: userId }));
                let status = yield newEvent.save();
                const user = yield user_1.default.findById(userId);
                user.hostedEvents.push(newEvent);
                yield user.save();
                status = yield status.populate("host");
                return Object.assign(Object.assign({}, status._doc), { _id: status._doc._id.toString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        createUser: (_, { user }, { res }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const findUser = yield user_1.default.findOne({ username: user.username });
                if (findUser) {
                    throw new Error("Username is taken, try another one");
                }
                const hashedPass = yield bcryptjs_1.default.hash(user.password, 12);
                const newUser = yield new user_1.default({
                    username: user.username,
                    name: user.name,
                    password: hashedPass,
                });
                const result = yield newUser.save();
                const token = (0, auth_1.createAccessToken)({
                    id: result._doc._id.toString(),
                    username: user.username,
                });
                res.cookie("jid", (0, auth_1.createRefreshToken)({
                    id: result._doc._id.toString(),
                    username: user.username,
                }), {
                    httpOnly: true,
                });
                return Object.assign(Object.assign({}, result._doc), { _id: result._doc._id.toString(), password: null, token, tokenExp: 1 });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        joinEvent: (_, { eventId }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                let event = yield event_1.default.findById(eventId);
                event.participants.push(userId);
                yield event.save();
                event = yield event.populate("host");
                event = yield event.populate("participants");
                return Object.assign(Object.assign({}, event._doc), { _id: event._doc._id.toString(), date: new Date(event._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        leaveEvent: (_, { eventId }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                yield event_1.default.updateOne({ _id: eventId }, {
                    $pull: {
                        participants: userId,
                    },
                });
                let event = yield event_1.default.findById(eventId);
                event = yield event.populate("host");
                event = yield event.populate("participants");
                return Object.assign(Object.assign({}, event._doc), { _id: event._doc._id.toString(), date: new Date(event._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
        updateEvent: (_, { eventId, event }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { isAuth, userId } = req;
            if (!isAuth) {
                throw new Error("Unauthenticated");
            }
            try {
                const updatedEvent = new event_1.default(Object.assign(Object.assign({}, event), { date: new Date(event.date).toISOString(), host: userId }));
                yield event_1.default.updateOne({ _id: eventId }, {
                    $set: {
                        title: event.title,
                        date: event.date,
                        category: event.category,
                        description: event.description,
                    },
                });
                let updated = yield event_1.default.findById(eventId);
                updated = yield updated.populate("host");
                updated = yield updated.populate("participants");
                return Object.assign(Object.assign({}, updated._doc), { _id: updated._doc._id.toString(), date: new Date(updated._doc.date).toISOString() });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }),
    },
};
exports.default = resolvers;
