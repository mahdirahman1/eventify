import bcrypt from "bcryptjs";
import graphqlFields from "graphql-fields";
import jwt from "jsonwebtoken";
import Event from "../models/event";
import User from "../models/user";

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
		event: async (_: any, { id }: any, context: any) => {
			if(!context.isAuth){
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
		user: async (_: any, { id }: any, context: any) => {
			if(!context.isAuth){
				throw new Error("Unauthenticated");
			}
			try {
				let user = await User.findById(id).populate({ path: "hostedEvents" });
				return { ...user._doc, _id: user._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		login: async (_: any, { username, password }: any) => {
			try {
				let user = await User.findOne({ username });
				if (!user) {
					throw new Error("User does not exist");
				}
				const authenticated = await bcrypt.compare(password, user.password);
				if (!authenticated) {
					throw new Error("Invalid validation");
				}
				const token = await jwt.sign(
					{ userId: user.id, email: user.email },
					"secret-shak",
					{ expiresIn: "1h" }
				);
				return { userId: user.id, token, tokenExp: 1 };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},

	Mutation: {
		createEvent: async (_: any, { event }: any, {isAuth, userId}: any, info: any) => {
			if(!isAuth){
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
		createUser: async (_: any, { user }: any, ___: any) => {
			try {
				const findUser = await User.findOne({ username: user.username });
				if (findUser) {
					throw new Error("User already exists");
				}
				const hashedPass = await bcrypt.hash(user.password, 12);
				const newUser = new User({
					username: user.username,
					name: user.name,
					password: hashedPass,
				});
				const result = await newUser.save();
				return {
					...result._doc,
					_id: result._doc._id.toString(),
					password: null,
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		joinEvent: async (_: any, { eventId }: any, {isAuth, userId}: any) => {
			if(!isAuth){
				throw new Error("Unauthenticated");
			}
			try {
				let event = await Event.findById(eventId);
				event.participants.push(userId);
				await event.save();
				event = await event.populate("host");
				event = await event.populate("participants");
				return { ...event._doc, _id: event._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		leaveEvent: async (_: any, { eventId }: any, {isAuth, userId}: any) => {
			if(!isAuth){
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
				return { ...event._doc, _id: event._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};

export default resolvers;
