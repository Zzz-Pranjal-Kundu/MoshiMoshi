import { Button, useDisclosure, Modal,ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl, Input, Box } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react';
import { ChatState } from "../../Context/ChatProvider"
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] =useState();
    const [selectedUser, setSelectedUser] =useState([]);
    const [search, setSearch] =useState("");
    const [searchResult, setSearchResult] =useState([]);
    const [loading, setLoading] =useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async(query) => {
        setSearch(query)
        if(!query){
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            // console.log(data);
            setLoading(false);
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
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id))
    };

    // const handleSubmit = async() => {
    //     if(!groupChatName || !selectedUser ){
    //         toast({
    //             title: "Please fill all the fields",
    //             status: "warning",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top",
    //         });
    //         return;
    //     }
    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         };
    //         const { data } = await axios.post('/api/chat/group',{
    //             name: groupChatName,
    //             users: JSON.stringify(selectedUser.map((u) => u._id)),
    //         },config);
    //         setChats([data, ...chats]);
    //         onClose();
    //         toast({
    //             title: "New Group Created!",
    //             status: "success",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom",
    //         });
    //     } catch (error) {
    //         toast({
    //             title: "Group chat creation failed",
    //             description: error.response.data,
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom",
    //         });
    //     }
    // };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUser.length === 0) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id)),
            }, config);
            
            setChats((prevChats) => {
                const updatedChats = [...prevChats, data].reduce((acc, chat) => {
                    if (!acc.some(c => c._id === chat._id)) acc.push(chat);
                    return acc;
                }, []);
                localStorage.setItem("chats", JSON.stringify(updatedChats));
                return updatedChats;
            });
            
            onClose();
            toast({
                title: "New Group Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Group chat creation failed",
                description: error.response?.data || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleGroup = (userToAdd) => {
        if(selectedUser.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUser([...selectedUser, userToAdd])
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="rgba(243, 240, 153, 1)">
                    <ModalHeader 
                    fontSize="30px" 
                    display="flex"
                    fontFamily="Work sans"
                    justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeholder='Group Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} bg="white" />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Search User' mb={1} onChange={(e) => handleSearch(e.target.value)} bg="white" />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUser.map(u => (
                                <UserBadgeItem key = {u._id} user={u} handleFunction={ () =>(handleDelete(u))} />
                            ))}
                        </Box>
                        {loading ? <div>loading</div> : (
                            searchResult?.slice(0,4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button color='#264E49' bg="#A5CF61" onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal


// import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl, Input, Box } from '@chakra-ui/react';
// import React, { useState } from 'react';
// import { ChatState } from "../../Context/ChatProvider";
// import axios from 'axios';
// import UserListItem from '../UserAvatar/UserListItem';
// import UserBadgeItem from '../UserAvatar/UserBadgeItem';

// const GroupChatModal = ({ children }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [groupChatName, setGroupChatName] = useState("");
//     const [selectedUser, setSelectedUser] = useState([]);
//     const [search, setSearch] = useState("");
//     const [searchResult, setSearchResult] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const toast = useToast();
//     const { user, chats, setChats } = ChatState();

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

//     const handleDelete = (delUser) => {
//         setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
//     };

//     const handleSubmit = async () => {
//         if (!groupChatName || selectedUser.length === 0) {
//             toast({
//                 title: "Please fill all the fields",
//                 status: "warning",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top",
//             });
//             return;
//         }
//         try {
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}` },
//             };
//             const { data } = await axios.post('/api/chat/group', {
//                 name: groupChatName,
//                 users: JSON.stringify(selectedUser.map((u) => u._id)),
//             }, config);
            
//             setChats((prevChats) => {
//                 const updatedChats = [...prevChats, data].reduce((acc, chat) => {
//                     if (!acc.some(c => c._id === chat._id)) acc.push(chat);
//                     return acc;
//                 }, []);
//                 localStorage.setItem("chats", JSON.stringify(updatedChats));
//                 return updatedChats;
//             });
            
//             onClose();
//             toast({
//                 title: "New Group Created!",
//                 status: "success",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//         } catch (error) {
//             toast({
//                 title: "Group chat creation failed",
//                 description: error.response?.data || "An error occurred",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//         }
//     };

//     const handleGroup = (userToAdd) => {
//         if (selectedUser.includes(userToAdd)) {
//             toast({
//                 title: "User already added",
//                 status: "warning",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top",
//             });
//             return;
//         }
//         setSelectedUser([...selectedUser, userToAdd]);
//     };

//     return (
//         <>
//             <span onClick={onOpen}>{children}</span>
//             <Modal isOpen={isOpen} onClose={onClose}>
//                 <ModalOverlay />
//                 <ModalContent bg="rgba(243, 240, 153, 1)">
//                     <ModalHeader fontSize="30px" display="flex" fontFamily="Work sans" justifyContent="center">
//                         Create Group Chat
//                     </ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody display="flex" flexDir="column" alignItems="center">
//                         <FormControl>
//                             <Input placeholder='Group Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} bg="white" />
//                         </FormControl>
//                         <FormControl>
//                             <Input placeholder='Search User' mb={1} onChange={(e) => handleSearch(e.target.value)} bg="white" />
//                         </FormControl>
//                         <Box w="100%" display="flex" flexWrap="wrap">
//                             {selectedUser.map(u => (
//                                 <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
//                             ))}
//                         </Box>
//                         {loading ? <div>Loading...</div> : (
//                             searchResult?.slice(0, 4).map(user => (
//                                 <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
//                             ))
//                         )}
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button color='#264E49' bg="#A5CF61" onClick={handleSubmit}>
//                             Create Chat
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default GroupChatModal;
