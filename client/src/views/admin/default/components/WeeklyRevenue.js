// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts"; 
import { getSampleBay } from "services/truck";
import { MdBarChart } from "react-icons/md";

export default function WeeklyRevenue(props) {

const { ...rest } = props;

  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const bays = await getSampleBay(); 

        const weeklyData = processChartData(bays);
        setChartData(weeklyData.data);
        setChartOptions(weeklyData.options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sample bay data:", error);
        setLoading(false);
      }
    };

    // fetchAndProcessData();
  }, []);

  const processChartData = (bays) => {
    const today = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = Array.from({ length: 7 }, () => ({ passed: 0, rejected: 0 }));

    bays.forEach((sample) => {
      const sampleDate = new Date(sample.createdAt);
      const dayIndex = (today.getDay() - sampleDate.getDay() + 7) % 7; 
      if (dayIndex < 7) {
        if (sample.sampleStatus === "PASSED") {
          weeklyData[dayIndex].passed += 1;
        } else if (sample.sampleStatus === "REJECTED") {
          weeklyData[dayIndex].rejected += 1;
        }
      }
    });

    const passedData = weeklyData.map((item) => item.passed).reverse();
    const rejectedData = weeklyData.map((item) => item.rejected).reverse();

    return {
      data: [
        {
          name: "Passed",
          data: passedData,
        },
        {
          name: "Rejected",
          data: rejectedData,
        },
      ],
      options: {
        chart: {
          type: "bar",
          stacked: true, 
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "20px",
          },
        },
        xaxis: {
          categories: daysOfWeek.map((day, i) => daysOfWeek[(today.getDay() - i + 7) % 7]).reverse(),
          title: { text: "Days of the Week" },
        },
        yaxis: {
          title: { text: "Count" },
          min: 0, 
          max: 20, 
          tickAmount: 4
        },
        colors: ["#4318FF", "#6AD2FF"], 
        legend: {
          position: "top",
          horizontalAlign: "center",
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          borderColor: "rgba(0,0,0,0.1)",
        },
      },
    };
  };

  if (loading) {
    return (
      <Card align="center" direction="column" w="100%" {...rest}>
        <Text>Loading...</Text>
      </Card>
    );
  }

  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Weekly Passed & Rejected Ratio
        </Text>
      </Flex>

      <Box h="240px" mt="auto" w="100%">
        <Chart options={chartOptions} series={chartData} type="bar" height="240" />
      </Box>
    </Card>
  );
}
