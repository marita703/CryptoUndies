import React, { FormEvent, useState } from "react";
import {
  Web3Button,
  useContract,
  useStorageUpload,
  MediaRenderer,
  useMintNFT,
  useAddress,
  MintNFTParams,
} from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
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
import { useRouter } from "next/router";

type MetadataFormData = {
  name: string;
  typeOfUnderwear: string;
  timeOn: string;
  timeOntype: string;
  material: string;
  image: string;
};

function UploadForm() {
  // Here we create the nft contract to interact with:
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "CryptoUndies"
  );
  // Here we access to the mintNFT function from the contract.
  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(nftCollection);

  //Here we access to the wallet that is currently conected:

  const address = useAddress();

  const addressString = address?.toString();

  const router = useRouter();

  //   this is the part to upload the image to IPFS
  const [uri, setUri] = useState<string[]>([]);
  const { mutateAsync: upload } = useStorageUpload();
  const onDrop = useCallback(
    async (acceptepFiles: File[]) => {
      const _uri = await upload({ data: acceptepFiles });
      setUri(_uri);
    },
    [upload]
  );

  const image = uri[0];
  typeof image === "string";
  console.log(image);
  const modifyImage = image?.replace("ipfs//", "https://ipfs.io/ipfs/");
  console.log(modifyImage);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { register, watch } = useForm<MetadataFormData>({
    defaultValues: {
      name: "",
      typeOfUnderwear: "",
      timeOn: "",
      timeOntype: "",
      material: "",
      image: uri[0],
    },
  });

  const typeOfUnderwear = watch("typeOfUnderwear");
  console.log(typeOfUnderwear);

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
              <Input type="text" {...register("name")} />
            </Box>
            <Box>
              <FormControl>
                <FormLabel>Type: </FormLabel>
                <Select
                  placeholder="Select option"
                  size="md"
                  {...register("typeOfUnderwear")}
                >
                  <option value="Panties">Panties</option>
                  <option value="Bra">Bra</option>
                  <option value="Boxers">Boxers</option>
                  <option value="Socks">Socks </option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel mt={2}>Time you had it on:</FormLabel>
                <Input
                  placeholder="0"
                  size="md"
                  type="number"
                  {...register("timeOn")}
                />
                <Select placeholder="Select option" size="md">
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel mt={2}>Material:</FormLabel>
                <Select
                  placeholder="Select option"
                  size="md"
                  {...register("timeOntype")}
                >
                  <option value="Latex">Latex</option>
                  <option value="Leader">Leader</option>
                  <option value="Textil">Textil</option>
                </Select>
              </FormControl>
            </Box>
            <Box>
              {address ? (
                <Web3Button
                  contractAddress={NFT_COLLECTION_ADDRESS}
                  action={(nftCollection) =>
                    nftCollection.erc721.mint({
                      name: watch("name"),
                      description: watch("typeOfUnderwear"),
                      image:
                        "https://ipfs.io/ipfs/QmbkSxnVXRd3AJi1MqLSQFvKbkBBrRsGcu2jpvjVWbGMjB/logo.png",
                    })
                  }
                >
                  Mint NFT
                </Web3Button>
              ) : (
                <Text> Please conect your wallet!</Text>
              )}
            </Box>
          </Stack>
        </form>
      </SimpleGrid>
    </Flex>
  );
}

export default UploadForm;
