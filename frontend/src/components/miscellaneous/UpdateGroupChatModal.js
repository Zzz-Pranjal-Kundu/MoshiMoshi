// import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl, Input, Box, IconButton, Spinner } from '@chakra-ui/react';
// import { ViewIcon } from '@chakra-ui/icons';
// import React, { useState } from 'react';
// import { ChatState } from "../../Context/ChatProvider";
// import axios from 'axios';
// import UserListItem from '../UserAvatar/UserListItem';
// import UserBadgeItem from '../UserAvatar/UserBadgeItem';

// const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [groupChatName, setGroupChatName] = useState("");
//     const [search, setSearch] = useState("");
//     const [searchResult, setSearchResult] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [renameLoading, setRenameLoading] = useState(false);

//     const toast = useToast();
//     const { selectedChat, setSelectedChat, user } = ChatState();

//     const handleSearch = async (query) => {
//         setSearch(query);
//         if (!query) return;
//         try {
//             setLoading(true);
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}` },
//             };
//             const { data } = await axios.get(`/api/user?search=${query}`, config);
//             setLoading(false);
//             setSearchResult(data);
//         } catch (error) {
//             toast({
//                 title: "Error Occurred!",
//                 description: "Failed to Load the Search Results",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom-left",
//             });
//         }
//     };

//     const handleRename = async () => {
//         if (!groupChatName.trim()) return; // Prevent empty rename
    
//         try {
//             setRenameLoading(true);
    
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}` },
//             };
    
//             const { data } = await axios.put("/api/chat/rename", {
//                 chatId: selectedChat._id,
//                 chatName: groupChatName.trim(),
//             }, config);
    
//             setSelectedChat(data); // Update chat state
//             setFetchAgain(!fetchAgain); // Trigger re-fetching
    
//             // Update local storage
//             localStorage.setItem("selectedChat", JSON.stringify(data));
    
//             setGroupChatName(""); // Clear input
//         } catch (error) {
//             toast({
//                 title: "Error Occurred!",
//                 description: error.response?.data || "An error occurred",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//         } finally {
//             setRenameLoading(false);
//         }
//     };
    

//     const handleAddUser = async (userToAdd) => {
//         if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
//             toast({
//                 title: "User already in the group!",
//                 status: "warning",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//             return;
//         }
//         try {
//             setLoading(true);
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}` },
//             };
//             const { data } = await axios.put("/api/chat/groupadd", {
//                 chatId: selectedChat._id,
//                 userId: userToAdd._id,
//             }, config);
//             setSelectedChat(data);
//             setFetchAgain(!fetchAgain);
//             setLoading(false);
//         } catch (error) {
//             toast({
//                 title: "Error Occurred!",
//                 description: error.response?.data || "An error occurred",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
//             <Modal isOpen={isOpen} onClose={onClose} isCentered>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader
//                         fontSize="35px"
//                         fontFamily="Work sans"
//                         display="flex"
//                         justifyContent="center"
//                     >
//                         {selectedChat.chatName}
//                     </ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
//                             {selectedChat.users.map(u => (
//                                 <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRename(u)} />
//                             ))}
//                         </Box>
//                         <FormControl display="flex">
//                             <Input
//                                 placeholder="Chat Name"
//                                 mb={3}
//                                 value={groupChatName}
//                                 onChange={(e) => setGroupChatName(e.target.value)}
//                             />
//                             <Button
//                                 variant="ghost"
//                                 colorScheme='teal'
//                                 ml={1}
//                                 isLoading={renameLoading}
//                                 onClick={handleRename}
//                             >
//                                 Update
//                             </Button>
//                         </FormControl>
//                         <FormControl>
//                             <Input placeholder='Search User To Add' mb={1} onChange={(e) => handleSearch(e.target.value)} bg="white" />
//                         </FormControl>
//                         {loading ? (
//                             <Spinner size="lg" />
//                         ) : (
//                             searchResult?.map(user => (
//                                 <UserListItem
//                                     key={user._id}
//                                     user={user}
//                                     handleFunction={() => handleAddUser(user)}
//                                 />
//                             ))
//                         )}
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button colorScheme='red' onClick={() => handleRename(user)}>
//                             Leave
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default UpdateGroupChatModal;


import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl, Input, Box, IconButton, Spinner } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from "../../Context/ChatProvider";
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName.trim()) return; // Prevent empty rename

        try {
            setRenameLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName.trim(),
            }, config);

            setSelectedChat(data); // Update chat state
            setFetchAgain(!fetchAgain); // Trigger re-fetching
            localStorage.setItem("selectedChat", JSON.stringify(data)); // Persist

            setGroupChatName(""); // Clear input
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response?.data || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setRenameLoading(false);
        }
    };

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User already in the group!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            localStorage.setItem("selectedChat", JSON.stringify(data)); // Persist update
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response?.data || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userToRemove) => {
        if (user._id !== selectedChat.groupAdmin._id && userToRemove._id !== user._id) {
            toast({
                title: "Only admins can remove members!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: userToRemove._id,
            }, config);

            userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            localStorage.setItem("selectedChat", JSON.stringify(data)); // Persist update
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response?.data || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroup = () => {
        handleRemoveUser(user);
    };

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemoveUser(u)} />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="ghost"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Search User To Add' mb={1} onChange={(e) => handleSearch(e.target.value)} bg="white" />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' onClick={handleLeaveGroup}>
                            Leave
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
