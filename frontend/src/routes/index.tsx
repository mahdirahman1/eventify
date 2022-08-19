import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Events from "../pages/Events";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import NewEvent from "../pages/NewEvent";
import MyEvents from "../pages/MyEvents";
import Settings from "../pages/Settings";

const createRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<ProtectedRoute />}>
				<Route path="/create" element={<NewEvent />} />
				<Route path="/my-events" element={<MyEvents />} />
				<Route path="/settings" element={<Settings />} />
			</Route>
			<Route path="/events" element={<Events />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
		</Routes>
	);
};

export default createRoutes;
