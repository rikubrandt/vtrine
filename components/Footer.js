import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" backgroundColor="gray.200" padding="1rem">
      <Flex justifyContent="center">
        <Text fontSize="sm" color="gray.600">
          &copy; {new Date().getFullYear()} Your App Name. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
