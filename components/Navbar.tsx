import { Avatar, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import NavBarButtonsData from "../Lib/NavBarButtonsData";
import NextLink from "next/link";

export function Navbar() {
  const address = useAddress();

  return (
    <Box maxW={"1200px"} m={"auto"} py={"10px"} px={"40px"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link as={NextLink} href="/">
          <Heading>CryptoUndies</Heading>
        </Link>
        <Flex direction={"row"}>
          {NavBarButtonsData.map((button) => {
            return (
              <Link as={NextLink} href={button.href} mx={2.5} key={button.name}>
                <Text>{button.name}</Text>
              </Link>
            );
          })}
        </Flex>
        <Flex dir={"row"} alignItems={"center"}>
          <ConnectWallet />
          {address && (
            <Link as={NextLink} href={`/profile/${address}`}>
              <Avatar src="https://bit.ly/broken-link" ml={"20px"} />
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
