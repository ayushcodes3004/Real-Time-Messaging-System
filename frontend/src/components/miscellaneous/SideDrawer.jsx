import { Button, Box, Text, Drawer, Input, Spinner, CloseButton } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { toaster } from '@/components/ui/toaster';
import { Menu } from "@chakra-ui/react"
import { Icon } from "@chakra-ui/react"
import { FaBell, FaSearch, FaChevronDown } from 'react-icons/fa'
import React from 'react'
import { Avatar, Portal } from "@chakra-ui/react"
import { ChatState } from "../../Context/ChatProvider.jsx"
import ProfileModal from './ProfileModal.jsx';
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from '../ChatLoading.jsx';
import UserListItem from '../UserAvatar/UserListItem.jsx';

const SideDrawer = () => {
    const [search, setSearch] = React.useState("");
    const [searchResult, setSearchResult] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [loadingChat, setLoadingChat] = React.useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { user, chats, setChats, setSelectedChat, notification, setNotification, logout } = ChatState();
    const history = useHistory();

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };
    const logoutHandler = () => {
        logout();
        history.push("/");
    }

    const handleSearch = async () => {
        if (!search) {
            toaster.create({
                title: "Please Enter something in search",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            if (!data.length) {
                toaster.create({
                    title: "No users found",
                    type: "info",
                    duration: 3000,
                });
            }
            setSearchResult(data);
        } catch (error) {
            toaster.create({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                type: "error",
                duration: 3000,
            });
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setSearch("");
            setSearchResult([]);
            setIsDrawerOpen(false);
        } catch (error) {
            toaster.create({
                title: "Error fetching the chat",
                description: error.message,
                type: "error",
                duration: 3000,
            });
            setLoadingChat(false);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip content="Search Users to chat" positioning={{ placement: 'bottom-end' }}>
                    <Button variant='ghost' _focus={{ outline: "none", boxShadow: "none" }} onClick={() => setIsDrawerOpen(true)}>
                        <Icon as={FaSearch} />
                        <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">Chat App</Text>
                <div>
                    <Box position="relative" display="inline-block">
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button p={1} bg="white" _focus={{ outline: "none", boxShadow: "none" }} position="relative">
                                    <Icon as={FaBell} fontSize="2xl" m={1} color="black" />
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {!notification?.length && (
                                            <Box p={4} textAlign="center">
                                                <Text>No New Messages</Text>
                                            </Box>
                                        )}
                                        {notification?.map((notif) => (
                                            <Menu.Item
                                                key={notif._id}
                                                value={notif._id}
                                                onClick={() => {
                                                    setSelectedChat(notif.chat);
                                                    setNotification(notification.filter((n) => n._id !== notif._id));
                                                }}
                                            >
                                                {notif.chat.isGroupChat
                                                    ? `New Message in ${notif.chat.chatName}`
                                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                        {notification?.length > 0 && (
                            <Box
                                position="absolute"
                                top="0"
                                right="0"
                                transform="translate(30%, -30%)"
                                borderRadius="full"
                                bg="red.500"
                                color="white"
                                fontSize="0.7em"
                                minW="18px"
                                h="18px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                px={1}
                            >
                                {notification.length}
                            </Box>
                        )}
                    </Box>
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button variant='ghost' _focus={{ outline: "none", boxShadow: "none" }}>
                                {/* <Text display={{ base: "none", md: "flex" }} px={4}>User Name</Text> */}
                                <Avatar.Root size="sm" cursor="pointer">
                                    <Avatar.Fallback name={user?.name} />
                                    <Avatar.Image src={user?.pic} />
                                </Avatar.Root>
                                <Icon as={FaChevronDown} />
                            </Button>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item value="profile" onClick={() => setIsProfileOpen(true)}>My Profile</Menu.Item>
                                    <Menu.Item value="logout" onClick={logoutHandler}>Logout</Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                    <ProfileModal user={user} open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                </div>
            </Box>
            <Drawer.Root placement="start" open={isDrawerOpen} onOpenChange={(details) => setIsDrawerOpen(details.open)}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header borderBottomWidth="1px">
                                <Drawer.Title>Search Users</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <Box display="flex" pb={2}>
                                    <Input
                                        placeholder="Search by name or email"
                                        mr={2}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Button onClick={handleSearch}>Go</Button>
                                </Box>
                                {loading ? (
                                    <ChatLoading />
                                ) : (
                                    searchResult?.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                )}
                                {loadingChat && <Spinner ml="auto" display="flex" />}
                            </Drawer.Body>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </>
    )
}

export default SideDrawer
