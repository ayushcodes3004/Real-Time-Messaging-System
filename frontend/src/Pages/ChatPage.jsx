import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider.jsx'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer.jsx'
import MyChats from '../components/MyChats.jsx'
import ChatBox from '../components/ChatBox.jsx'

const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage
