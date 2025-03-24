import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdOutlinePersonPin,
  MdAdminPanelSettings,
  MdOutlineLocalShipping,
  MdShoppingBasket,
  MdTrendingUp,
  MdOutlineList
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Store from "views/admin/store";
import User from "views/admin/user";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import Modules from "views/admin/modules";
import RTL from "views/admin/rtl";
import Role from 'views/admin/roles'
import Permission from "views/admin/permission";
import Trucks from "views/admin/trucks";
import Sample from "views/admin/sampler";
import { useSelector } from "react-redux";
// Auth Imports
import SignInCentered from "views/auth/signIn";
import BarcodeGenerator from "components/barcode/BarcodeGenerator";
import Marketplace from "views/admin/marketplace";
import Listing from "views/admin/listing";

// const { users, token } = useSelector((state) => state.user.data.roles.permission);
const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },

  {
    name: "Store",
    layout: "/admin",
    path: "/store",
    icon: <Icon as={MdShoppingBasket} width='20px' height='20px' color='inherit' />,
    component: Store,
  },

  {
    name: "Marketplace",
    layout: "/admin",
    path: "/marketplace",
    icon: <Icon as={MdTrendingUp} width='20px' height='20px' color='inherit' />,
    component: Marketplace,
  },

  {
    name: "Listing",
    layout: "/admin",
    path: "/listing",
    icon: <Icon as={MdOutlineList} width='20px' height='20px' color='inherit' />,
    component: Listing,
  },


// if(users.name.includes('read:users')){
//   {
//     name: "User",
//     layout: "/admin",
//     path: "/user",
//     icon: <Icon as={MdOutlinePersonPin} width='20px' height='20px' color='inherit' />,
//     component: User,
//     permission: "read:users", 
//   },
// // }
//   {
//     name: "Role",
//     layout: "/admin",
//     path: "/role",
//     icon: <Icon as={MdAdminPanelSettings} width='20px' height='20px' color='inherit' />,
//     component: Role,
//     permission: "read:roles", 
//   },
//   // {
//   //   name: "Permission",
//   //   layout: "/admin",
//   //   path: "/permission",
//   //   icon: <Icon as={MdAdminPanelSettings} width='20px' height='20px' color='inherit' />,
//   //   component: Permission,
//   // },
//   {
//     name: "Trucks",
//     layout: "/admin",
//     path: "/trucks",
//     icon: <Icon as={MdOutlineLocalShipping} width='20px' height='20px' color='inherit' />,
//     component: Trucks,
//     permission: "read:trucks", 
//   },
//   // {
//   //   name: "Sample",
//   //   layout: "/admin",
//   //   path: "/sample",
//   //   icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
//   //   component: Sample,
//   //   permission: "read:samples", 
//   // },
//   {
//     name: "Profile",
//     layout: "/admin",
//     path: "/profile",
//     icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
//     component: Profile,
//   },
//   {
//     // name: "Sign In",
//     layout: "/auth",
//     path: "/sign-in",
//     // icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
//     component: SignInCentered,
//     hideInSidebar: true,
//   },
];

export default routes;