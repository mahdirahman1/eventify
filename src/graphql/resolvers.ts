import bcrypt from "bcryptjs";
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
		event: async (_: any, { id }: any) => {
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
		user: async (_: any, { id }: any) => {
			//return users.filter((user) => user._id == id)[0];
			try {
				let user = await User.findById(id).populate({ path: "hostedEvents" });
				return { ...user._doc, _id: user._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},

	Mutation: {
		createEvent: async (_: any, { event }: any, ___: any) => {
			try {
				const newEvent = new Event({
					...event,
					date: new Date(event.date).toISOString(),
					host: "625703b9a5b2b7b1ae9b3e79",
				});
				let status = await newEvent.save();
				const user = await User.findById("625703b9a5b2b7b1ae9b3e79");
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
				const findUser = await User.findOne({ email: user.email });
				if (findUser) {
					throw new Error("User already exists");
				}
				const hashedPass = await bcrypt.hash(user.password, 12);
				const newUser = new User({
					email: user.email,
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
		joinEvent: async (_: any, { eventId }: any, ___: any) => {
			try {
				let event = await Event.findById(eventId);
				event.participants.push("62574032c895edab69477843");
				await event.save();
				event = await event.populate("host");
				event = await event.populate("participants");
				return { ...event._doc, _id: event._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		leaveEvent: async (_: any, { eventId }: any, ___: any) => {
			try {
				await Event.updateOne(
					{ _id: eventId },
					{
						$pull: {
							"participants":  "62574032c895edab69477843",
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
