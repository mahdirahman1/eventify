import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	hostedEvents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	],
});

export default mongoose.model("User", userSchema);
