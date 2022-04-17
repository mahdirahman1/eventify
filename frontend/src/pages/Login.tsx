import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Checkbox,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.100", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all the fun <Link color={"blue.400"} onClick={() => navigate("/events")}>events</Link> ✌️
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<FormControl id="email">
							<FormLabel>Username</FormLabel>
							<Input type="email" isRequired/>
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input type="password" />
						</FormControl>
						<FormControl>
							<Button
								w="100%"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
							>
								Sign in
							</Button>
						</FormControl>
					</Stack>
					<Stack pt={6}>
							<Text align={"center"}>
								Need an account?{" "}
								<Link color={"blue.400"} onClick={() => navigate("/signup")}>
									Signup
								</Link>
							</Text>
						</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default Login;
