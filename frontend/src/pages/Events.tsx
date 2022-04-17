import { Button } from "@chakra-ui/react";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Events = () => {
	const navigate = useNavigate();
	return (
		<div>
			<Button onClick={() => navigate("/auth")}>test</Button>
		</div>
	);
};

export default Events;
