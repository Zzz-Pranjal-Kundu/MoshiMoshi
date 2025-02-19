import React, { useState } from 'react';
import {Box} from "@chakra-ui/layout";
import { Drawer, DrawerBody, Input, Spinner, Toast, useToast } from "@chakra-ui/react";
import {Avatar, DrawerContent, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip, useDisclosure} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {Button} from "@chakra-ui/button"
import { Text } from '@chakra-ui/layout';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const history = useHistory();
    const logoutHandler = () =>{
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch = async() => {
        if(!search){
            Toast({
                title: "No user entered",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,

                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the search result",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
    
            const { data } = await axios.post("/api/chat", { userId }, config);
            console.log("✅ New Chat Created:", data);
    
            setChats((prevChats) => {
                const updatedChats = [data, ...prevChats];
                localStorage.setItem('chats', JSON.stringify(updatedChats));
                return updatedChats;
            });
    
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoadingChat(false);
        }
    };
    
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5 px 10px" borderWidth="5px" background="#E3E566">
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{base:"none",md:"flex"}} px="4px">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work Sans">
                「✦Moshi Moshi✦」
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && " No New Messages"}
                            {notification.map(notif => (
                                <MenuItem key={notif._id}>
                                    {notif.chat.isGroupChat? `New Message in ${notif.chat.chatName}`: `New Message from ${getSender(user,notif.chat.users)}`};
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} m={1}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList bg="wheat" p="10px" borderRadius="10px">
                            <ProfileModal user={user}>
                                <MenuItem bg="wheat">My Profile</MenuItem>
                            </ProfileModal>
                            {/* <MenuDivider/> */}
                            <MenuItem bg="wheat" onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg="#558257">
                    <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
                    <DrawerBody bg="#264E49">
                        <Box display="flex" pb={2}>
                            <Input placeholder='Search  by name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} bg="white" />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading?(
                            <ChatLoading/>
                        ):
                        (
                            searchResult?.map(user =>
                                <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
                            )
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;
