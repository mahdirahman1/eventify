import Event from "../models/event";
import User from "../models/user";

const resolvers = {
	Query: {
		events: async () => {
			try {
				const events = await Event.find();
				return events.map((event) => {
					return { ...event._doc, _id: event.id };
				});
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		event: async (_: any, { id }: any) => {
			try {
				const events = await Event.find({ _id: id });
				const foundEvent = events[0];
				return {...foundEvent._doc, _id: foundEvent._doc._id.toString()}
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		user: (_: any, { id }: any) => {
			//return users.filter((user) => user._id == id)[0];
		},
	},

	Mutation: {
		createEvent: async (_: any, { event }: any, ___: any) => {
			try {
				const newEvent = new Event({ ...event, date: new Date(event.date) });
				const status = await newEvent.save();
				console.log(status);
				return { ...status._doc, _id: status._doc._id.toString() };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
		createUser: (_: any, { user }: any, ___: any) => {
			// users.push(user);
			// console.log(users);
			// return user;
		},
	},
};

export default resolvers;
