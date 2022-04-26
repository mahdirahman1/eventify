import {
	Box,
	BoxProps,
	Drawer,
	DrawerContent,
	Flex,
	useDisclosure,
	Text,
	CloseButton,
	useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import NavItem from "./NavItem";
import MobileNav from "./MobileNav";
import { unauthItems, authenticatedItems } from "./config";
import useAuth from "../../hooks/useAuth";

const Navbar = ({ children }: { children: ReactNode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
			<SideBarContent
				onClose={onClose}
				display={{ base: "none", md: "block" }}
			/>

			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SideBarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}
			</Box>
		</Box>
	);
};

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SideBarContent = ({ onClose, ...rest }: SidebarProps) => {
	const { loggedIn } = useAuth();
	const links = loggedIn ? authenticatedItems : unauthItems;
	return (
		<Box
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
					EventApp
				</Text>
				<CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
			</Flex>
			{links.map((link) => (
				<NavItem key={link.name} icon={link.icon} link={link.to}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

export default Navbar;
