/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAddTask,
  MdApproval,
  MdAttachMoney,
  MdBarChart,
  MdCancel,
  MdCheckCircle,
  MdOutlineScale,
} from "react-icons/md";

import { useState, useEffect } from "react";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

import { dailyWeight } from "./components/DailyWeight";
import { getTotalWeight, getSampleReport } from "services/truck";
import { get } from "react-hook-form";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const [weightData, setWeightData] = useState({ totalWeight: 0, label: "" });
  const [sampleCountPassed, setSampleCountPassed] = useState(0);
  const [sampleCountRejected, setSampleCountRejected] = useState(0);

  // const response = getSampleReport()
  // console.log(response, "sample report");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const weights = await getTotalWeight();
  //       const processedWeightData = dailyWeight(weights);
  //       setWeightData(processedWeightData);

  //       const sampleReport = await getSampleReport();
  //       setSampleCountPassed(sampleReport.sampleCountPassedToday || 0);
  //       setSampleCountRejected(sampleReport.sampleCountRejectedToday || 0);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3}}
        gap="40px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="70px"
              h="70px"
              bg={boxBg}
              icon={
                <Icon w="40px" h="40px" as={MdCheckCircle} color={"green"} />
              }
            />
          }
          name="Samples Passed"
          value={sampleCountPassed}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="70px"
              h="70px"
              bg={boxBg}
              icon={<Icon w="40px" h="40px" as={MdCancel} color={"red"} />}
            />
          }
          name="Samples Rejected"
          value={sampleCountRejected}
        />
        {/* <MiniStatistics growth='+23%' name='Sales' value='$574.34' /> */}
        <MiniStatistics
          startContent={
            <IconBox
              w="70px"
              h="70px"
              bg={boxBg}
              icon={
                <Icon w="40px" h="40px" as={MdOutlineScale} color={"black"} />
              }
            />
          }
          name={`Total Weight (${weightData.label})`}
          value={`${weightData.totalWeight} kg`}
        />
        {/* <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        />  */}
        {/* <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935'
        /> */}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <Tasks />
          <MiniCalendar h="100%" minW="100%" selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
      <p>@2024 copyright all rights reserverd and made by <strong>Hasan Anwar & Muskan Nagdev</strong></p>
    </Box>
  );
}
