import { StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const Card = ({ eventInfo }: any) => {
	const { category, title, participants, host, date } = eventInfo;
	const formattedDate = new Date(date);

	return (
		<Box
			maxW="sm"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			bg={useColorModeValue("white", "gray.700")}
			cursor="pointer"
		>
			<Box p="6">
				<Box
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<Badge borderRadius="full" px="2" colorScheme="teal">
						{category}
					</Badge>
					<Box
						color="gray.500"
						fontWeight="semibold"
						letterSpacing="wide"
						fontSize="xs"
						textTransform="uppercase"
						ml="2"
					>
						{formattedDate.toDateString()}
					</Box>
				</Box>

				<Box
					display="flex"
					mt="4"
					as="span"
					color="gray.600"
					textTransform="uppercase"
					fontSize="xl"
					fontWeight={"bold"}
				>
					{title}
				</Box>

				<Box
					display="flex"
					mt="2"
					alignItems="center"
					justifyContent={"space-between"}
					flexWrap={"wrap"}
					fontSize="sm"
				>
					{`Hosted by ${host.name}`}
					<Box color="gray.600" fontSize="sm">
						{`${participants.length} participants`}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Card;
