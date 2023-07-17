import bcrypt from "bcryptjs";
import Event from "../models/event";
import User from "../models/user";
import { createAccessToken, createRefreshToken } from "./auth";
import { CustomContext } from "./context";

const resolvers = {
	Query: {
		events: async () => {
			try {
				const events = await Event.find()
					.populate({
						path: "host",
						populate: {
							path: "hostedEvents",
						},
					})
					.populate("participants");
				return events.map((event) => {
					return {
						...event._doc,
						_id: event.id,
						date: new Date(event._doc.date).toISOString(),
					};
				});
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		editEvent: async (_: any, { id }: any, { req }: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				const events = await Event.find({ _id: id })
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

				return {
					...foundEvent._doc,
					_id: foundEvent._doc._id.toString(),
					date: new Date(foundEvent._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		deleteEvent: async (_: any, { id }: any, { req }: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				const events = await Event.find({ _id: id })
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

				await Event.deleteOne({ _id: id });

				return {
					...foundEvent._doc,
					_id: foundEvent._doc._id.toString(),
					date: new Date(foundEvent._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		event: async (_: any, { id }: any, { req }: any) => {
			const { isAuth } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				const events = await Event.find({ _id: id })
					.populate({
						path: "host",
						populate: {
							path: "hostedEvents",
						},
					})
					.populate("participants");
				const foundEvent = events[0];
				return {
					...foundEvent._doc,
					_id: foundEvent._doc._id.toString(),
					date: new Date(foundEvent._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		user: async (_: any, { id }: any, { req }: any) => {
			const { isAuth } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				let user = await User.findById(id).populate({
					path: "hostedEvents",
					populate: { path: "host" },
				});
				const hostedEvents = user._doc.hostedEvents.map(
					(event: { _doc: any; date: string | number | Date }) => {
						return { ...event._doc, date: new Date(event.date).toISOString() };
					}
				);

				return { ...user._doc, _id: user._doc._id.toString(), hostedEvents };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		login: async (
			_: any,
			{ username, password }: any,
			{ res }: CustomContext
		) => {
			try {
				let user = await User.findOne({ username });
				if (!user) {
					throw new Error("User does not exist");
				}
				const authenticated = await bcrypt.compare(password, user.password);
				if (!authenticated) {
					throw new Error("Invalid validation");
				}
				const token = createAccessToken(user);

				res.cookie("jid", createRefreshToken(user), {
					httpOnly: true,
				});

				return { userId: user.id, token, tokenExp: 1 };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		logout: async (_: any, __: any, { res }: CustomContext) => {
			res.clearCookie("jid");
			return { success: true };
		},
	},

	Mutation: {
		createEvent: async (_: any, { event }: any, { req }: any, info: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				const newEvent = new Event({
					...event,
					date: new Date(event.date).toISOString(),
					host: userId,
				});
				let status = await newEvent.save();
				const user = await User.findById(userId);
				user.hostedEvents.push(newEvent);
				await user.save();
				status = await status.populate("host");
				return { ...status._doc, _id: status._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		createUser: async (_: any, { user }: any, { res }: CustomContext) => {
			try {
				const findUser = await User.findOne({ username: user.username });
				if (findUser) {
					throw new Error("Username is taken, try another one");
				}
				const hashedPass = await bcrypt.hash(user.password, 12);
				const newUser = await new User({
					username: user.username,
					name: user.name,
					password: hashedPass,
				});
				const result = await newUser.save();
				const token = createAccessToken({
					id: result._doc._id.toString(),
					username: user.username,
				});

				res.cookie(
					"jid",
					createRefreshToken({
						id: result._doc._id.toString(),
						username: user.username,
					}),
					{
						httpOnly: true,
					}
				);

				return {
					...result._doc,
					_id: result._doc._id.toString(),
					password: null,
					token,
					tokenExp: 1,
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		joinEvent: async (_: any, { eventId }: any, { req }: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				let event = await Event.findById(eventId);
				event.participants.push(userId);
				await event.save();
				event = await event.populate("host");
				event = await event.populate("participants");
				return {
					...event._doc,
					_id: event._doc._id.toString(),
					date: new Date(event._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		leaveEvent: async (_: any, { eventId }: any, { req }: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				await Event.updateOne(
					{ _id: eventId },
					{
						$pull: {
							participants: userId,
						},
					}
				);
				let event = await Event.findById(eventId);
				event = await event.populate("host");
				event = await event.populate("participants");
				return {
					...event._doc,
					_id: event._doc._id.toString(),
					date: new Date(event._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		updateEvent: async (_: any, { eventId, event }: any, { req }: any) => {
			const { isAuth, userId } = req;
			if (!isAuth) {
				throw new Error("Unauthenticated");
			}
			try {
				const updatedEvent = new Event({
					...event,
					date: new Date(event.date).toISOString(),
					host: userId,
				});
				await Event.updateOne(
					{ _id: eventId },
					{
						$set: {
							title: event.title,
							date: event.date,
							category: event.category,
							description: event.description,
						},
					}
				);

				let updated = await Event.findById(eventId);
				updated = await updated.populate("host");
				updated = await updated.populate("participants");
				return {
					...updated._doc,
					_id: updated._doc._id.toString(),
					date: new Date(updated._doc.date).toISOString(),
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};

export default resolvers;
