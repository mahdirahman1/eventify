import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	useColorModeValue,
	FormErrorMessage,
	Textarea,
	Select,
	HStack,
	useMediaQuery,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const NewEvent = () => {
	const [largerThan530] = useMediaQuery("(min-width: 531px)");
	const [fieldErrors, setFieldErrors] = useState({
		title: false,
		category: false,
		date: false,
	});
	const titleRef: any = useRef();
	const catRef: any = useRef();
	const dateTimeRef: any = useRef();
	const descRef: any = useRef();

	const resetFields = () => {
		catRef.current.value = "";
		titleRef.current.value = "";
		dateTimeRef.current.value = "";
		descRef.current.value = "";
	};
	const createEventHandler = () => {};
	return (
		<Flex minH={"100vh"} bg={useColorModeValue("gray.100", "gray.800")}>
			<Stack spacing={8} width={"80vw"} mx={"auto"} py={12} px={12}>
				<Heading fontSize={"4xl"}>Create Event</Heading>

				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={"100%"}
					p={8}
				>
					<Stack spacing={6}>
						<FormControl id="title">
							<FormLabel>Title</FormLabel>
							<Input type="text" isRequired ref={titleRef} />
						</FormControl>
						{largerThan530 ? (
							<HStack>
								<FormControl id="category">
									<FormLabel>Category</FormLabel>
									<Select placeholder="Select option" ref={catRef}>
										<option value="sports">Sports</option>
										<option value="party">Party</option>
										<option value="miscellaneous">Miscellaneous</option>
									</Select>
								</FormControl>
								<FormControl id="date">
									<FormLabel>Date & Time</FormLabel>
									<Input type="datetime-local" ref={dateTimeRef} />
								</FormControl>
							</HStack>
						) : (
							<Stack spacing={6}>
								<FormControl id="category">
									<FormLabel>Category</FormLabel>
									<Select placeholder="Select option" ref={catRef}>
										<option value="sports">Sports</option>
										<option value="party">Party</option>
										<option value="miscellaneous">Miscellaneous</option>
									</Select>
								</FormControl>
								<FormControl id="date">
									<FormLabel>Date & Time</FormLabel>
									<Input type="datetime-local" ref={dateTimeRef} />
								</FormControl>
							</Stack>
						)}
						<FormControl id="desc">
							<FormLabel>Description</FormLabel>
							<Textarea ref={descRef} />
						</FormControl>

						<FormControl isInvalid>
							<HStack>
								<Button w="50%" onClick={resetFields}>
									Reset
								</Button>
								<Button
									w="50%"
									bg={"teal.400"}
									color={"white"}
									_hover={{
										bg: "teal.500",
									}}
									loadingText="Signing In"
									type="submit"
									onClick={createEventHandler}
								>
									Create
								</Button>
							</HStack>
						</FormControl>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default NewEvent;
