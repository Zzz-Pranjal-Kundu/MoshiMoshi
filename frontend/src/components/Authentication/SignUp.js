import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handlePasswordClick = () => setShowPassword(!showPassword);
    const handleConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "MOSHIMOSHI");
            data.append("cloud_name", "dvlsudywp");
            fetch("https://api.cloudinary.com/v1_1/dvlsudywp/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an Image(JPEG/PNG)!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || "Error occurred, please try again.";
            toast({
                title: "Error Occurred",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <VStack spacing='3px'>
            <FormControl id='first-name-signup' isRequired> {/* Unique ID for 'first-name' */}
                <FormLabel color="black">Name</FormLabel>
                <Input placeholder='Enter your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email-signup' isRequired> {/* Unique ID for 'email' */}
                <FormLabel color="black">Email</FormLabel>
                <Input placeholder='Enter your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password-signup' isRequired> {/* Unique ID for 'password' */}
                <FormLabel color="black">Password</FormLabel>
                <InputGroup>
                    <Input type={showPassword ? "text" : "password"}
                        placeholder='Enter your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handlePasswordClick}>
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password-signup' isRequired> {/* Unique ID for 'confirm-password' */}
                <FormLabel color="black">Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={showConfirmPassword ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleConfirmPasswordClick}>
                            {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic-signup">
                <FormLabel color="black">Upload your Profile Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="green"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                SignUp
            </Button>
        </VStack>
    );
}

export default SignUp;
