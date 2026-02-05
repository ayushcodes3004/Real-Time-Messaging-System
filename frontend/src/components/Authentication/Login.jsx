import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { Field } from "@chakra-ui/react"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { Button } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import axios from 'axios'
import { useHistory } from 'react-router-dom'



const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toaster.create({
                title: "Please Fill all the Fields",
                type: "warning",
                duration: 5000,
                closable: true,
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
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            toaster.create({
                title: "Login Successful",
                type: "success",
                duration: 5000,
                closable: true,
            });
            history.push("/chat");
        } catch (error) {
            toaster.create({
                title: "Error Occurred!",
                description: error.response.data.message,
                type: "error",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
        }
    }
    return (
        <VStack spacing="5px" color='black'>
            <Field.Root id="email" required>
                <Field.Label>Email</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    pl="1rem"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Field.Root>
            <Field.Root id="password" required>
                <Field.Label>Password</Field.Label>
                <InputGroup>
                    <Input
                        border="1px solid black"
                        width="100%"
                        h="2.5rem"
                        pl="1rem"
                        value={password}
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem" top="50%" transform="translateY(-50%)">
                        <Button h="1.75rem" size="sm" colorPalette="cyan" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Field.Root>
            <Button
                colorPalette="cyan"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
        </VStack>
    )
}

export default Login
