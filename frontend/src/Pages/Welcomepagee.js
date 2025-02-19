import React from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import './Welcomepagee.css'; // Import the CSS file

const WelcomePage = () =>{
    const history = useHistory();
    const goToHomepage = () => {
        history.push("/login-signup");
    };
    return (
        <Box className="welcome-container">
            <Heading className="welcome-heading">
                「✦Moshi Moshi✦」
            </Heading>
            <Button 
                colorScheme="whatsapp" 
                onClick={goToHomepage}
                size="lg"
                mt={4}
                className="welcome-button"
            >
                Get Started
            </Button>
        </Box>
    );
};
export default WelcomePage;