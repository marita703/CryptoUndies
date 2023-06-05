import React, { FormEvent, useEffect, useState } from "react";
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
import { NFTStorage, File } from "nft.storage";

type MetadataFormData = {
  name: string;
  typeOfUnderwear: string;
  timeOn: number;
  timeOntype: string;
  material: string;
  image: string;
};

function UploadForm() {
  // Here is the dotenvConfiguration
  const dotenv = require("dotenv");
  dotenv.config();

  // Here we create the nft contract to interact with:
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );
  // Here we access to the mintNFT function from the contract.
  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(nftCollection);

  //Here we access to the wallet that is currently conected:

  const address = useAddress();

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

  console.log("uri: ", uri);
  const gatewayUrl = "https://ipfs.io/ipfs/";
  const httpUrl = gatewayUrl + uri[0]?.replace("ipfs://", "");

  const fetchIPFSContent = async (url: string): Promise<Blob> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    return blob;
  };

  fetchIPFSContent(httpUrl)
    .then((blob) => {
      console.log(blob);
      const r = blob;
      return r;
    })
    .catch((error) => {
      console.error(error);
    });

  //  This is to use the Dropzone hook. in order to conect it with the UseStorageUpload

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  async function storeExampleNFT() {
    const image = await getExampleImage();
    const nft = {
      image, // use image Blob as `image` field
      name: "CrytpUndies ",
      description: "The metaverse is here. Where is it all being stored?",
      properties: {
        type: "blog-post",
        origins: {
          http: "https://blog.nft.storage/posts/2021-11-30-hello-world-nft-storage/",
          ipfs: "ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/",
        },
        authors: [{ name: "David Choi" }],
        content: {
          "text/markdown":
            "The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>",
        },
      },
    };
    const apiKeyNftStorage: string = process.env.MY_API_KEY_NFT_STORAGE || "";
    const client = new NFTStorage({ token: apiKeyNftStorage });
    const metadata = await client.store(nft);

    console.log("NFT data stored!");
    console.log("Metadata URI: ", metadata.url);
  }

  //This is to get the values from the form
  const { register, watch } = useForm<MetadataFormData>({
    defaultValues: {
      name: "",
      typeOfUnderwear: "",
      timeOn: 0,
      timeOntype: "",
      material: "",
      image: uri[0],
    },
  });

  function createMetadata() {
    const metadata = {
      name: watch("name"),
      typeOfUnderwear: watch("typeOfUnderwear"),
      timeOn: watch("timeOn"),
      timeOntype: watch("timeOntype"),
      material: watch("material"),
      image: uri[0],
    };
    const metadataJson = JSON.stringify(metadata);

    console.log(metadataJson);

    return metadataJson;
  }

  // Here is the code for NFTSTORAGE

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
                  action={() => createMetadata}
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
