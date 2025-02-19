import React from "react";
import './Homepage.css';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const Homepage = () => {
    return (
        <div className="container">
            <div className="Header">
                <p id="Name_Of_the_App">「✦MoshiMoshi✦」</p>
            </div>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded" colorScheme="whatsapp">
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels p={0}> {/* Remove padding on the TabPanels */}
                        <TabPanel p={0}> {/* Remove padding on each TabPanel */}
                            <Login />
                        </TabPanel>
                        <TabPanel p={0}> {/* Remove padding on the SignUp TabPanel */}
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </div>
    );
};

export default Homepage;
