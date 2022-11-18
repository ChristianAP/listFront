import {
  Box,
  Button,
  FormControl,
  Image,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import React from "react";

export const ProviderUploadImageInput = ({
  image,
  setImage,
  setFile,
  name,
  title_button,
}: {
  image: string;
  setImage: (val: string) => void;
  setFile?: any;
  title_button?: string;
  name?: string;
}) => {
  const [prev, setPrev] = useState(image);

  const [load, setLoad] = useState(false);

  const file = useRef(null);

  const handleFile = () => {
    // @ts-ignore
    file.current.click();
  };

  const handleImage = () => {
    // @ts-ignore
    setPrev(URL.createObjectURL(file.current.files[0]));
    // @ts-ignore
    setImage(file.current.files[0]);
    getBase64Image(file.current);
  };
  //@ts-ignore
  function getBase64Image(element) {
    var file = element.files[0];
    setFile(element.files);
    var reader = new FileReader();
    reader.onloadend = function () {};
    reader.readAsDataURL(file);
  }

  return (
    <>
      <FormControl mb={3}>
        <Skeleton isLoaded={load} height="full">
          <Image
            className="card-img-top img-fluid"
            w={"100%"}
            h={"100%"}
            id="img"
            onLoad={() => setLoad(true)}
            src={prev}
            alt="Images"
          />
        </Skeleton>
        <Button
          type="button"
          className="btn btn-success w-100 h-100"
          id="btn-file"
          variant="solid"
          colorScheme="green"
          width={["100%", "100%", "100%", "100%", "100%"]}
          onClick={handleFile}
        >
          <span className="btn-icon-left text-success">
            <i className="fa fa-upload color-success"></i>
          </span>
          {title_button ? title_button : "Subir Imagen"}
        </Button>
        <Input
          ref={file}
          accept="image/png,image/jpeg"
          type="file"
          hidden
          onChange={handleImage}
          name={name}
        />
        <Box backgroundColor={'#FEEBC8'} marginTop={2} p={2}>
          <Text fontSize="sm">*Se aceptan solo imagenes.</Text>
        </Box>
      </FormControl>
    </>
  );
};
