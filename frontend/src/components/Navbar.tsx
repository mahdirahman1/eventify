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
	FlexProps,
	Icon,
	IconButton,
} from "@chakra-ui/react";
import { ReactNode, ReactText } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Auth from "../pages/Login";
import Events from "../pages/Events";
import {
	FiCompass,
    FiLogIn,
	FiStar,
	FiSettings,
	FiMenu,
    FiUserPlus
} from "react-icons/fi";
import { IconType } from "react-icons";

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
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

interface LinkItemProps {
	name: string;
	icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: "Explore Events", icon: FiCompass },
	{ name: "Login", icon: FiLogIn },
	{ name: "Sign Up", icon: FiUserPlus },
	{ name: "Favourites", icon: FiStar },
	{ name: "Settings", icon: FiSettings },
];

interface NavItemProps extends FlexProps {
	icon: IconType;
	children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
	return (
		<Link to="#" style={{ textDecoration: "none" }}>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: "cyan.400",
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 24 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent="flex-start"
			{...rest}
		>
			<IconButton
				variant="outline"
				onClick={onOpen}
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
				Logo
			</Text>
		</Flex>
	);
};

export default Navbar;
