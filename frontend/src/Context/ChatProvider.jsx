import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Start with null state
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    const history = useHistory();

    // Initialize user state from localStorage when component mounts
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        }
    }, []);

    useEffect(() => {
        // Function to handle localStorage changes
        const handleStorageChange = () => {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (userInfo && !user) {
                // User info exists in localStorage but not in state - this happens after login
                setUser(userInfo);
            } else if (!userInfo && user) {
                // User info doesn't exist in localStorage but exists in state - logout
                setUser(null);
            }
        };

        // Check immediately
        handleStorageChange();

        // Listen for storage events (triggered when localStorage is changed from other tabs/windows)
        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events that we'll dispatch after login/logout
        window.addEventListener('userLogin', handleStorageChange);
        window.addEventListener('userLogout', handleStorageChange);

        // Redirect if no user and not on login page
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo && history.location.pathname !== "/" && 
            history.location.pathname !== "/login" && 
            history.location.pathname !== "/signup") {
            history.push("/");
        }

        // Cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLogin', handleStorageChange);
            window.removeEventListener('userLogout', handleStorageChange);
        };
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, history])

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        // Dispatch a custom event to notify other components of logout
        window.dispatchEvent(new Event('userLogout'));
    };

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, logout }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;