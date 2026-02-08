import { Badge, Box } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorPalette="purple"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            {admin === user._id && <span> (Admin)</span>}
            <Box as={LuX} pl={1} display="inline" />
        </Badge>
    );
};

export default UserBadgeItem;
