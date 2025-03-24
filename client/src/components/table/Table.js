import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Icon,
  Box,
  Input,
} from "@chakra-ui/react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useTranslation } from "react-i18next";
import { MdEdit, MdDelete } from "react-icons/md";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import FilterMenu from "components/menu/DynamicFilter";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "store/redux/slices/filter";
import { IoMdEyeOff } from "react-icons/io";
import { SearchBar } from "components/navbar/searchBar/SearchBar";

export default function ColumnsTable(props) {
  const {
    columnsData,
    tableData,
    heading,
    onDelete,
    onUpdate,
    onShow,
    menusData,
    filterOptions,
  } = props;

  const { secondary } = props;
  let menuBg = useColorModeValue("white", "navy.800");

  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(11);

  const calculatePageSize = () => {
    const tableHeight = window.innerHeight - 300;
    const rowHeight = 50; // Approximate height of a table row in pixels
    return Math.floor(tableHeight / rowHeight);
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const tableBorderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "brand.100" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter.filters);

  const [selectedFilters, setSelectedFilters] = useState({ ...filters });

  const isWithinDateRange = (date, startDate, endDate) => {
    const currentDate = new Date(date);
    return currentDate >= startDate && currentDate <= endDate;
  };

  useEffect(() => {
    
    resetFilters();
  }, []);

  const applyFilters = () => {
    Object.entries(selectedFilters).forEach(([key, value]) => {
      dispatch(setFilter({ key, value }));
    });
  };

  // const resetFilters = () => {
  //   const resetState = Object.keys(filters).reduce((acc, key) => {
  //     acc[key] = key === "createdAt" ? "" : key; 
  //     return acc;
  //   }, {});
  
  //   setSelectedFilters(resetState); 
  //   Object.entries(resetState).forEach(([key, value]) => {
  //     dispatch(setFilter({ key, value })); 
  //   });
  // };
  
  const resetFilters = () => {
    const resetState = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ""; 
      return acc;
    }, {});
  
    setSelectedFilters(resetState); 
  
    Object.entries(resetState).forEach(([key, value]) => {
      dispatch(setFilter({ key, value })); 
    });
  };
  
  

  // const filteredData = useMemo(() => {
  //   return tableData.filter((row) => {
  //     let isValid = true;
  
  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value && value !== key) {
  //         if (key === "createdAt") {
  //           const rowDate = new Date(row[key]).toISOString().split("T")[0];
  //           const filterDate = new Date(value).toISOString().split("T")[0];
  //           isValid = isValid && rowDate === filterDate;
  //         } else {
  //           isValid = isValid && row[key] === value;
  //         }
  //       }
  //     });
  
  //     return isValid;
  //   });
  // }, [tableData, filters]);

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        // if (!value || value === key) return true; 
        if (!value) return true; 
  
        if (key === "createdAt") {
          const rowDate = new Date(row.createdAt).toISOString().split("T")[0];
          const filterDate = new Date(value).toISOString().split("T")[0];
          return rowDate === filterDate;
        }
  
        // if (key === "Role") {
        
        //   return row.roles.some((role) => role.name === value);
        // }
        if (key === "Role") {
          return (
            Array.isArray(row.roles) &&
            row.roles.some((role) => role.name && role.name === value)
          );
        }
        
        return row[key] === value;
      });
    });
  }, [tableData, filters]);
  
  

  useEffect(() => {
    setPageSize(calculatePageSize());

    const handleResize = () => setPageSize(calculatePageSize());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => filteredData, [filteredData]);
  console.log(data, "filtered data");
  const { t } = useTranslation();

  const handleUpdate = (item) => {
    onUpdate(item);
    gotoPage(currentPageIndex);
  };

  const handleDelete = (item) => {
    onDelete(item);
    gotoPage(currentPageIndex);
  };

  const handleShow = (item) => {
    onShow(item);
    // gotoPage(currentPageIndex);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPageIndex, pageSize },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex },
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageOptions,
  } = tableInstance;

  useEffect(() => {
    setCurrentPageIndex(pageIndex);
  }, [pageIndex]);

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Menu menusData={menusData} />
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Flex
            alignItems="center"
            flexDirection="row"
            p="10px"
            gap='8'
            borderRadius="30px"
          >
            {filterOptions &&
              Object.entries(filterOptions).map(([key, options]) => (
                <FilterMenu
                  key={key}
                  options={[...options]}
                  defaultOption={selectedFilters[key] || key}
                  onSelect={(value) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [key]: value,
                    }))
                  }
                  style={{
                    marginLeft: "15px", 
                    width: "200px", 
                    border: "1px solid #ccc", 
                    borderRadius: "5px", 
                    padding: "8px", 
                    overflow: "hidden",
                    whiteSpace: "nowrap", 
                    textOverflow: "ellipsis", 
                  }}
                />
              ))}
            <Input
              type="date"
              value={selectedFilters.createdAt || ""}
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  createdAt: e.target.value,
                }))
              }
              ml="10px"
              width="200px" 
              border="1px solid #ccc" 
              borderRadius="5px" 
              padding="8px"
            />
            <Button
              colorScheme="blue"
              ml="10px"
              p="20px"
              onClick={applyFilters}
            >
              Filter
            </Button>
            <Button
              colorScheme="gray"
              ml="10px"
              p="20px"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Box overflowX="auto">
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={column.id}
                    borderColor={tableBorderColor}
                  >
                    <Flex
                      justify="center"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
                {(onUpdate || onDelete || onShow) && (
                  <Th pe="10px" borderColor={tableBorderColor}>
                    <Flex
                      justify="center"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {t("global:actions")}
                    </Flex>
                  </Th>
                )}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {
              (page?.length === 0) ? 
                <Tr>
                  <Td colSpan={6}>
                    <p style={{
                      textAlign: 'center'
                    }}>No data found!</p>
                  </Td>
                </Tr>
              :
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={row.original.id || row.index}>
                      {/* {console.log(row.original, "row.original")} */}
                      {row.cells.map((cell) => (
                        <Td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          fontSize={{ sm: "14px" }}
                          minW="150px"
                          borderColor="transparent"
                        >
                          <Flex justify="center" align="center">
                            <Text
                              color="secondaryGray.900"
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.render("Cell")}
                            </Text>
                          </Flex>
                        </Td>
                      ))}
                      {(onUpdate || onDelete || onShow) && (
                        <Td minW="150px" borderColor="transparent">
                          <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="10px"
                          >
                            {onUpdate && (
                              <Button
                                align="center"
                                justifyContent="center"
                                bg={bgButton}
                                _hover={bgHover}
                                _focus={bgFocus}
                                _active={bgFocus}
                                w="40px"
                                h="40px"
                                lineHeight="100%"
                                borderRadius="10px"
                                onClick={() => handleUpdate(row.original)}
                              >
                                <Icon as={MdEdit} h="20px" w="20px" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                align="center"
                                justifyContent="center"
                                bg={bgButton}
                                _hover={bgHover}
                                _focus={bgFocus}
                                _active={bgFocus}
                                w="40px"
                                h="40px"
                                lineHeight="100%"
                                borderRadius="10px"
                                onClick={() => handleDelete(row.original)}
                              >
                                <Icon as={MdDelete} h="20px" w="20px" />
                              </Button>
                            )}
                            {onShow && (
                              <Button
                                align="center"
                                justifyContent="center"
                                bg={bgButton}
                                _hover={bgHover}
                                _focus={bgFocus}
                                _active={bgFocus}
                                w="40px"
                                h="40px"
                                lineHeight="100%"
                                borderRadius="10px"
                                onClick={() => handleShow(row.original)}
                              >
                                <Icon as={IoMdEyeOff} h="20px" w="20px" />
                              </Button>
                            )}
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  );
                })
            }
          </Tbody>
        </Table>
      </Box>

      {
        (pageOptions?.length > 0) &&
          <Flex justify="center" align="center" mt="4">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
            >
              {t("global:previous")}
            </Button>
            {pageOptions.map((item) => (
              <Button
                key={item}
                onClick={() => gotoPage(item)}
                disabled={pageIndex === item}
                variant={pageIndex === item ? "outline" : "darkBrand"}
                color={pageIndex === item ? "brand.500" : "white"}
                fontSize="sm"
                fontWeight="500"
                borderRadius="70px"
                px="10px"
                py="10px"
                mx="5px"
              >
                {item + 1}
              </Button>
            ))}
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
            >
              {t("global:next")}
            </Button>
          </Flex>
      }
      
    </Card>
  );
}
