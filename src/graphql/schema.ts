import { gql } from "apollo-server-express";

export default gql`
	type Query {
		events: [Event!]!
		event(id: ID!): Event!
		user(id: ID!): User!
	}

	type Mutation {
		createEvent(event: EventInput): Event!
		createUser(user: UserInput): User!
	}

	input UserInput {
		email: String!
		password: String!
	}

	type User {
		_id: ID!
		email: String!
		password: String
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
	}
`;
