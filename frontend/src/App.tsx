import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Events from "./pages/Events";
import "./App.css";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
				<Route path="*" element={<RoutesWithNav />} />
			</Routes>
		</div>
	);
}

const RoutesWithNav = () => {
	return (
		<Navbar>
			<Routes>
				<Route path="/" element={<Navigate replace to="/events" />} />
				<Route path="/events" element={<Events />} />
			</Routes>
		</Navbar>
	);
};

export default App;
