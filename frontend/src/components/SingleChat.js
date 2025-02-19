import React, { useState } from 'react';
import { Box, Flex, FormControl, IconButton, Input, Spinner, Text, Toast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal"; 
import axios from 'axios';
import { useEffect } from 'react';
import "./styles.css";
import ScrollableChats from './ScrollableChats';
import Lottie from 'react-lottie';
import animationData from "../animations/LottieTyping1.json"

import io from "socket.io-client"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [ messages, setMessages ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ newMessage, setNewMessage ] = useState("");
    const [ socketConnected, setSocketConnected ] = useState(false);
    const [ typing, setTyping ] = useState(false);
    const [ isTyping, setIsTyping ] = useState(false);

    // For Lottie typing animation
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    // const fetchMessages = async() => {
    //     if(!selectedChat)
    //         return;
    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         };

    //         setLoading(true);
    //         const { data } = await axios.get(`/api/message/${selectedChat._id}`,
    //             config
    //         );

    //         console.log(messages);
    //         setMessages(data);
    //         setLoading(false);
    //     } catch (error) {
    //         Toast({
    //             title: "Error Occurred!",
    //             description: "Failed to load the messages",
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom",
    //         });
    //     }
    // };

    // useEffect(() => {
    //     fetchMessages();
    // }, [selectedChat]);    //whenever the selected chat (user) hanges, fetch the chats again

    // const sendMessage = async(event) => {
    //     if(event.key==="Enter" && newMessage){
    //         try {
    //             const config = {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${user.token}`,
    //                 },
    //             };

    //             setNewMessage("");
    //             const { data } = await axios.post("/api/message", {
    //                 content: newMessage,
    //                 chatId: selectedChat._id,
    //             }, config);

    //             console.log(data);

    //             setMessages([...messages, data]);
    //         } catch (error) {
    //             Toast({
    //                 title: "Error Occurred!",
    //                 description: "Failed to send the message",
    //                 status: "error",
    //                 duration: 5000,
    //                 isClosable: true,
    //                 position: "bottom",
    //             });
    //         }
    //     }
    // };

    //Socket IO (initialize the socket firsts and then do other operations)
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing',() => setIsTyping(true));
        socket.on('stop typing',() => setIsTyping(false));
    }, []);

    useEffect(() => {       // The fetchMessages function is placed inside useEffect to automatically fetch messages whenever selectedChat changes.
        if (!selectedChat) return;

        const fetchMessages = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                setLoading(true);
                const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

                // console.log("Fetched Messages for:", selectedChat._id, data);
                setMessages(data);
                setLoading(false);

                // join room using the chatId of the current chat
                socket.emit('joinChat', selectedChat._id);
            } catch (error) {
                console.error("Error fetching messages:", error);
                Toast({
                    title: "Error Occurred!",
                    description: "Failed to load the messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        };

        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat, user]); // Dependencies updated

    
    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if((!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)){
                //notify the user
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    useEffect(() => {
        // console.log("Updated Messages State:", messages);
    }, [messages]); // Logs when messages change

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                // console.log("Message Sent:", data);
                setMessages((prevMessages) => [...prevMessages, data]); // Updates state correctly
                socket.emit('new message', data);
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
                Toast({
                    title: "Error Occurred!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };
    

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indiator Logic
        if(!socketConnected)
                return;
        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        // Debouncing funtion : if user has not typed anything for the last 3 sec then istyping->false
        let lastTyingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow-lastTyingTime;
            if(timeDiff>=timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    };
    
    return (
        <>{
            selectedChat ? (
                <Box 
                    display="flex" 
                    flexDir="column" 
                    w="100%" 
                    h="100%" 
                    p={3}
                >
                    {/* Header */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                        pb={3}
                    >
                        <IconButton 
                            display={{ base: "flex", md: "none" }} 
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        
                        {/* <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
                            {!selectedChat.isGroupChat 
                                ? getSender(user, selectedChat.users) 
                                : selectedChat.chatName.toUpperCase()}
                        </Text>

                        {!selectedChat.isGroupChat && (
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        )} */}


                        <Flex alignItems="center" justifyContent="space-between" gap={2} w="100%">
                            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
                                {!selectedChat.isGroupChat 
                                ? getSender(user, selectedChat.users)
                                : selectedChat.chatName.toUpperCase()}
                            </Text>

                            {!selectedChat.isGroupChat ? (
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            ) : (
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            )}
                        </Flex>

                    </Box>

                    {/* Messages Container */}
                    <Box
                        display="flex"
                        flexDir="column"
                        flex={1}  // Takes available space
                        bg="#E8E8E8"
                        borderRadius="lg"
                        overflowY="hidden"  // Enables scrolling
                        p={3}
                    >
                        {loading ? ( 
                            <Spinner 
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto" /> ) : (
                            <div style={{ flexGrow: 1, overflowY: "auto" }} className='messages'>
                                {/* Messages Here */}
                                <ScrollableChats messages={messages} />
                            </div>)}

                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                {isTyping ? <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0}}
                                    />
                                </div> : <></>}
                                <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." onChange={typingHandler} value={newMessage} />
                            </FormControl>
                    </Box>
                </Box>
            ) : (
                <Box display={{ base: "none", md: "flex" }} alignItems="center" justifyContent="center" h="100%" textAlign="center">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
        }</>
    );
}

export default SingleChat;
