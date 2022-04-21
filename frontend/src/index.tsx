import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store";

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
	cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById(
	"root"
) as HTMLElement);
root.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<ApolloProvider client={client}>
				<ChakraProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ChakraProvider>
			</ApolloProvider>
		</ReduxProvider>
	</React.StrictMode>
);
