import { Button, FormControl, FormLabel, Input, InputGroup, InputRightAddon, InputRightElement, VStack} from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [show,setShow] = useState(false);
    const [loading,setLoading] =useState(false);

    const toast = useToast();
    const history = useHistory();
    const handleClick = () => setShow(!show);
    const submitHandler = async()=>{
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duraton: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user/login",
                {email, password },
                config
            );
            toast({
                title: "Login Successful",
                status: "success",
                duraton: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        }
        catch(error){
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duraton: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel color="black">Name</FormLabel>
            <Input placeholder='Enter your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel color="black">Email</FormLabel>
            <Input placeholder='Enter your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel color="black">Password</FormLabel>
            <InputGroup>
            <Input type={show? "text" : "password"}
                placeholder='Enter your Password'
                onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="3.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme="green"
            width="100%"
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading={loading}
        >Login</Button>
    </VStack>
  )
}
export default Login