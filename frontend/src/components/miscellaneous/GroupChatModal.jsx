import { Dialog, Button, Input, Box, Field } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toaster.create({
                title: "User already added",
                type: "warning",
                duration: 5000,
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
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
            });
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toaster.create({
                title: "Please fill all the feilds",
                type: "warning",
                duration: 5000,
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            setOpen(false);
            toaster.create({
                title: "New Group Chat Created!",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            toaster.create({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
            <Dialog.Trigger asChild>
                <span>{children}</span>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.CloseTrigger />
                    <Dialog.Header>
                        <Dialog.Title
                            fontSize="35px"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent="center"
                            w="100%"
                        >
                            Create Group Chat
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Box display="flex" flexDir="column" alignItems="center" w="100%">
                            <Field.Root w="100%">
                                <Input
                                    placeholder="Chat Name"
                                    mb={3}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root w="100%">
                                <Input
                                    placeholder="Add Users eg: John, Piyush, Jane"
                                    mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Field.Root>
                            <Box w="100%" display="flex" flexWrap="wrap">
                                {selectedUsers.map((u) => (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleDelete(u)}
                                    />
                                ))}
                            </Box>
                            {loading ? (
                                // <ChatLoading />
                                <div>Loading...</div>
                            ) : (
                                searchResult
                                    ?.slice(0, 4)
                                    .map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleGroup(user)}
                                        />
                                    ))
                            )}
                        </Box>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={handleSubmit} colorPalette="blue">
                            Create Chat
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default GroupChatModal;
