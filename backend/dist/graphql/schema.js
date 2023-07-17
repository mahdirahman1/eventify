"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = (0, apollo_server_express_1.gql) `
	type Query {
		events: [Event!]!
		event(id: ID!): Event!
		editEvent(id: ID!): Event!
		deleteEvent(id: ID!): Event!
		user(id: ID!): User!
		login(username: String!, password: String): AuthData!
		logout: LogOut!
	}

	type Mutation {
		createEvent(event: EventInput): Event!
		createUser(user: UserInput): User!
		joinEvent(eventId: ID!): Event!
		leaveEvent(eventId: ID!): Event!
		updateEvent(eventId: ID!, event: EventInput!): Event!
	} 

	type LogOut {
		success: String!
	}

	type AuthData {
		userId: ID!
		token: String!
		tokenExp: Int!
	}

	input UserInput {
		username: String!
		name: String!
		password: String!
	}

	type User {
		_id: ID!
		name: String!
		username: String!
		password: String
		hostedEvents: [Event!]
		token: String
		tokenExp: Int
	}

	input EventInput {
		title: String!
		description: String!
		date: String!
		category: String!
	}

	type Event {
		_id: ID!
		title: String!
		description: String
		date: String!
		category: String!
		host: User!
		participants: [User!]
	}
`;
