import { gql } from "apollo-server-express";

export default gql`
	type Query {
		events: [Event!]!
		event(id: ID!): Event!
		user(id: ID!): User!
		login(username: String!, password: String): AuthData!
	}

	type Mutation {
		createEvent(event: EventInput): Event!
		createUser(user: UserInput): User!
		joinEvent(eventId: ID!): Event!
		leaveEvent(eventId: ID!): Event!
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
		description: String!
		date: String!
		category: String!
		host: User!
		participants: [User!]
	}
`;
