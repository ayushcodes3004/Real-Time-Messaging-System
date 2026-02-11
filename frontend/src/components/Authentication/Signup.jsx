import React from 'react'
import { VStack, Field, Input, InputGroup, Button } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Signup = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [pic, setPic] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();

    const handleClick = () => setShow(!show);
    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toaster.create({
                title: "Please Select an Image!",
                type: "warning",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dgbl3ty3k");
            fetch("https://api.cloudinary.com/v1_1/dgbl3ty3k/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toaster.create({
                title: "Please Select an Image!",
                type: "warning",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
            return;
        }
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toaster.create({
                title: "Please Fill all the Fields",
                type: "warning",
                duration: 5000,
                closable: true,
            });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toaster.create({
                title: "Passwords Do Not Match",
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
                "/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            toaster.create({
                title: "Registration Successful",
                type: "success",
                duration: 5000,
                closable: true,
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            // Dispatch a custom event to notify the ChatProvider of login
            window.dispatchEvent(new Event('userLogin'));
            setLoading(false);
            // navigate to chat or home
            history.push("/chats");
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
        <VStack gap="5px" color='black'>
            <Field.Root id="first-name" required>
                <Field.Label>Name</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    pl="1rem"
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
                    pl="1rem"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Field.Root>
            <Field.Root id="password" required>
                <Field.Label>Password</Field.Label>
                <InputGroup
                    endElement={
                        <Button h="1.75rem" size="sm" colorPalette="cyan" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    }
                >
                    <Input
                        border="1px solid black"
                        width="100%"
                        h="2.5rem"
                        pl="1rem"
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>
            </Field.Root>
            <Field.Root id="confirm-password" required>
                <Field.Label>Confirm Password</Field.Label>
                <InputGroup
                    endElement={
                        <Button h="1.75rem" size="sm" colorPalette="cyan" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    }
                >
                    <Input
                        border="1px solid black"
                        width="100%"
                        h="2.5rem"
                        pl="1rem"
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </InputGroup>
            </Field.Root>
            <Field.Root id="pic" required>
                <Field.Label>Upload your Picture</Field.Label>
                <Input
                    border="1px solid black"
                    width="100%"
                    h="2.5rem"
                    pl="1rem"
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </Field.Root>
            <Button
                colorPalette="cyan"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                loading={loading}
            >
                Register
            </Button>
        </VStack>
    )
}

export default Signup
