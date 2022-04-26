import React from "react";
import "./App.css";
import Navbar from "./components/Nav/Navbar";
import createRoutes from "./routes";


function App() {
	const routes = createRoutes();
	return (
		<div className="App">
			<Navbar>
				{routes}
			</Navbar>
		</div>
	);
}

export default App;
