import React, { useState } from "react";
import {
  Web3Button,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  useStorageUpload,
  MediaRenderer,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../const/addresses";
import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Input,
  Select,
  Button,
  SelectProps,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

type MetadataFormData = {
  name: string;
  typeOfUnderwear: string;
  timeOn: string;
  timeOntype: string;
  material: string;
};

function UploadForm() {
  const [uri, setUri] = useState<string[]>([]);
  const { mutateAsync: upload } = useStorageUpload();
  const onDrop = useCallback(
    async (acceptepFiles: File[]) => {
      const _uri = await upload({ data: acceptepFiles });
      setUri(_uri);
    },
    [upload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { register, handleSubmit } = useForm<MetadataFormData>({
    defaultValues: {
      name: "",
      typeOfUnderwear: "",
      timeOn: "",
      timeOntype: "",
      material: "",
    },
  });

  return (
    <Flex justify="center">
      <SimpleGrid columns={2} spacing={10} p={5}>
        {/* Box for upload */}
        {/* Box for the image */}
        <Stack>
          <div>
            {uri.map((uri) => {
              return (
                <MediaRenderer
                  alt="nftImage"
                  key={uri}
                  src={uri}
                ></MediaRenderer>
              );
            })}
          </div>
          <Stack>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button>Upload Image</Button>
            </div>
          </Stack>
        </Stack>

        {/* Metadata Creator */}
        <form>
          <Stack spacing={8}>
            <Text>Undies Traits!</Text>
            <Box>
              <FormLabel> Name:</FormLabel>
              <Input type="text" />
            </Box>
            <Box>
              <FormControl>
                <FormLabel>Type: </FormLabel>
                <Select placeholder="Select option" size="md">
                  <option value="option1">Panties</option>
                  <option value="option2">Bra</option>
                  <option value="option3">Boxers</option>
                  <option value="option4">Socks </option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel mt={2}>Time you had it on:</FormLabel>
                <Input placeholder="0" size="md" type="number" />
                <Select placeholder="Select option" size="md">
                  <option value="option1">Minutes</option>
                  <option value="option2">Hours</option>
                  <option value="option3">Days</option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel mt={2}>Material:</FormLabel>
                <Select placeholder="Select option" size="md">
                  <option value="option1">Latex</option>
                  <option value="option2">Leader</option>
                  <option value="option3">Textil</option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Web3Button contractAddress={NFT_COLLECTION_ADDRESS}>
                Mint Now!
              </Web3Button>
            </Box>
          </Stack>
        </form>
      </SimpleGrid>
    </Flex>
  );
}

export default UploadForm;
