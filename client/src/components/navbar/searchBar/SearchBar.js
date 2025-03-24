import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "store/redux/slices/search";
export function SearchBar(props) {
 
  const { variant, background, children, placeholder, borderRadius, ...rest } =
    props;

    const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query); 

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value)); 
  };
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  return (
    <InputGroup w={{ base: "100%", md: "200px", lg:"300px"}} {...rest}>
      <InputLeftElement
        children={
          <IconButton
            bg='inherit'
            borderRadius='inherit'
            _hover='none'
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={
              <SearchIcon color={searchIconColor} w='17px' h='17px' />
            }></IconButton>
        }
      />
      <Input
        variant='search'
        fontSize='sm'
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight='500'
        _placeholder={{ color: "gray.400", fontSize: "16px" }}
        borderRadius={borderRadius ? borderRadius : "30px"}
        placeholder={placeholder ? placeholder : "Search..."}
        value={query}
        onChange={handleSearchChange}
      />
    </InputGroup>
  );
}
