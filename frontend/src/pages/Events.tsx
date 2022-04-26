import { Button } from "@chakra-ui/react";
import React from "react";
import {  useNavigate } from "react-router-dom";

const Events = () => {
	const navigate = useNavigate();
	return (
		<div>
			<Button onClick={() => navigate("/tests")}>test</Button>
		</div>
	);
};

export default Events;
