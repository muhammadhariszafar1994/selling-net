import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
} from "@chakra-ui/react";
import { MdExpandMore } from "react-icons/md";

export default function FilterMenu({ options, defaultOption, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(defaultOption || options[0]);

  // Synchronize selected option with defaultOption when it changes
  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (onSelect) onSelect(option);
  };

  return (
    <Menu>
      <MenuButton as={Button} color={"gray.400"} rightIcon={<Icon as={MdExpandMore} />}>
        {selectedOption}
      </MenuButton>
      <MenuList>
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleOptionSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
