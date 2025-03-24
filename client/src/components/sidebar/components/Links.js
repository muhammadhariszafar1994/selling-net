/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useHasPermission } from "utils/helper";
import { useSelector } from "react-redux";
import { useMemo } from "react";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
 

  // Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");


  const isSuperAdmin = useSelector((state) => state.user.user.isSuperAdmin);


  const { routes } = props;
  const permissions = useHasPermission(); 
  const permissionsSet = useMemo(() => new Set(permissions.map((perm) => perm.name)), [permissions]);


  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {

      if (route.hideInSidebar) return null;

       const userHasPermission = isSuperAdmin || !route.permission || permissionsSet.has(route.permission);


       if (userHasPermission) {
  
        if (route.category) {
          return (
            <>
              <Text
                fontSize={"md"}
                color={activeColor}
                fontWeight="bold"
                mx="auto"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                pt="18px"
                pb="12px"
                key={index}
              >
                {route.name}
              </Text>
              {createLinks(route.items)}
            </>
          );
        } if (
          route.layout === "/admin" ||
          route.layout === "/auth" ||
          route.layout === "/rtl"
        ) {
    
          return (
            <NavLink key={index} to={route.layout + route.path}>
              {/* {console.log("Layout", route.layout + route.path)} */}
              {route.icon ? (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : textColor
                        }
                        me="18px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                        }
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h="36px"
                      w="4px"
                      bg={
                        activeRoute(route.path.toLowerCase()) ? brandColor : "transparent"
                      }
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                      }
                    >
                      {route.name}
                    </Text>
                    <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                  </HStack>
                </Box>
              )}
            </NavLink>
          );
        }
      }

      
      return null;
    });
  };

  return createLinks(routes); 
}

export default SidebarLinks;

