import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Input,
  Container,
} from "@chakra-ui/react";
import React from "react";
import UploadForm from "../components/UploadForm";

function Upload() {
  return (
    <Container>
      <UploadForm />
    </Container>
  );
}

export default Upload;
