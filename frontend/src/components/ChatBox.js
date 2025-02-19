import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = ChatState();
    return (
        <Box 
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }} 
            alignItems="center" 
            flexDir="column"
            justifyContent="center" 
            h="100%" 
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            background="white"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox
