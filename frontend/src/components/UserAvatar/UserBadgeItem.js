import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
       backgroundImage="radial-gradient(circle, #F48A83 35%, #E23E34 100%)"
        color="white"
        cursor="pointer"
        onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem
