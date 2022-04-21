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
	FormErrorMessage,
} from "@chakra-ui/react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_USER = gql`
	query Query($email: String!, $password: String) {
		login(email: $email, password: $password) {
			userId
			token
		}
	}
`;

const Login = () => {
	const navigate = useNavigate();
	const emailRef: any = useRef();
	const passRef: any = useRef();

	interface opvars {
		email: string;
		password: string;
	}

	const [login, { loading, error, data }] = useLazyQuery<opvars>(LOGIN_USER);

	useEffect(
		() => {
			if (data && !loading) {
				navigate("/events")
			}
		},
		[data, loading, navigate]
	);

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.100", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} >
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all the fun{" "}
						<Link color={"blue.400"} onClick={() => navigate("/events")}>
							events
						</Link>{" "}
						✌️
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
					border={error ? "2px solid red" : ''}
				>
					<Stack spacing={4}>
						<FormControl id="email">
							<FormLabel>Username</FormLabel>
							<Input type="text" ref={emailRef} isRequired />
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input type="password" ref={passRef} />
						</FormControl>
						<FormControl isInvalid>
							<Button
								w="100%"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								disabled={loading}
								type="submit"
								onClick={() =>
									login({
										variables: {
											email: emailRef.current.value,
											password: passRef.current.value,
										},
									})
								}
							>
								Sign in
							</Button>
							<FormErrorMessage justifyContent="center">{error?.message}</FormErrorMessage>
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
