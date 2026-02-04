import React from 'react'
import { VStack } from "@chakra-ui/layout"
import { Field } from "@chakra-ui/react"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { Button } from "@chakra-ui/react"


const Signup = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [pic, setPic] = React.useState("");
    const [show, setShow] = React.useState(false);

    const handleClick = () => setShow(!show);
    const postDetails = (pic) => { }
    const submitHandler = () => { }

    return (
        <VStack spacing="5px" color='black'>
            <Field.Root id="first-name" required>
                <Field.Label>Name</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </Field.Root>
            <Field.Root id="email" required>
                <Field.Label>Email</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    placeholder="Enter your email"
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
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem" display="flex" alignItems="center">
                        <Button h="1.75rem" size="sm" colorScheme="cyan" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Field.Root>
            <Field.Root id="confirm-password" required>
                <Field.Label>Confirm Password</Field.Label>
                <InputGroup>
                    <Input
                        border="1px solid black"
                        width="100%"
                        h="2.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem" display="flex" alignItems="center">
                        <Button h="1.75rem" size="sm" colorScheme="cyan" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Field.Root>
            <Field.Root id="pic" required>
                <Field.Label>Upload your Picture</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </Field.Root>
            <Button
                colorScheme="cyan"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                Register
            </Button>
        </VStack>
    )
}

export default Signup
