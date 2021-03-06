import mongoose, { Schema } from "mongoose";

const eventsSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	date: {
		type: Date,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	host: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

export default mongoose.model("Event", eventsSchema);
