import {
    Dialog,
    Button,
    Input,
    Box,
    Field,
    IconButton,
    Spinner,
    Portal,
    CloseButton,
} from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
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
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toaster.create({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                type: "error",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            console.log(data._id);
            // setSelectedChat("");
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toaster.create({
                title: "Error Occured!",
                description: error.response.data.message,
                type: "error",
                duration: 5000,
                closable: true,
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toaster.create({
                title: "User Already in group!",
                type: "error",
                duration: 5000,
                closable: true,
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toaster.create({
                title: "Only admins can add someone!",
                type: "error",
                duration: 5000,
                closable: true,
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
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setSearchResult([]);
            setSearch("");
            setLoading(false);
        } catch (error) {
            toaster.create({
                title: "Error Occured!",
                description: error.response.data.message,
                type: "error",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toaster.create({
                title: "Only admins can remove someone!",
                type: "error",
                duration: 5000,
                closable: true,
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
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toaster.create({
                title: "Error Occured!",
                description: error.response.data.message,
                type: "error",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
            <Dialog.Trigger asChild>
                <IconButton display={{ base: "flex" }} variant="ghost" aria-label="Update Group">
                    <LuEye />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            fontSize="35px"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent="center"
                        >
                            <Dialog.Title>{selectedChat.chatName}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body display="flex" flexDir="column" alignItems="center">
                            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                                {selectedChat.users.map((u) => (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        admin={selectedChat.groupAdmin}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                ))}
                            </Box>
                            <Box display="flex" w="100%" alignItems="center" mb={3}>
                                <Input
                                    placeholder="Chat Name"
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button
                                    variant="solid"
                                    colorPalette="teal"
                                    ml={1}
                                    loading={renameloading}
                                    onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </Box>
                            <Field.Root>
                                <Input
                                    placeholder="Add User to group"
                                    mb={1}
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Field.Root>

                            {loading ? (
                                <Spinner size="lg" />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={() => handleRemove(user)} colorPalette="red">
                                Leave Group
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default UpdateGroupChatModal;