"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    events: [Event!]!
    event: Event
  }

  type Mutation {
    createEvent(event: String): String!
  }

  type Event {
    id: ID!
    name: String!
    date: String!
    image: String!
  }

`;
exports.default = typeDefs;
