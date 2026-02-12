import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Container, Box, Text, Tabs } from "@chakra-ui/react"
import Login from '../components/Authentication/Login.jsx'
import Signup from '../components/Authentication/Signup.jsx'

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box d="flex" justifyContent="center" p={3} bg="white" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl" fontFamily="Work Sans" color="black" textAlign="center">ChatterBox</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List>
            <Tabs.Trigger value="tab-1">Login</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">Register</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1"><Login /></Tabs.Content>
          <Tabs.Content value="tab-2"><Signup /></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default HomePage
