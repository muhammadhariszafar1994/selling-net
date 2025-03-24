import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import BarChart from "components/charts/BarChart";
import { findOne } from "services/truck"; 
export default function SamplerDetail({
  isOpen,
  onClose,
  truckId,
  // sampleDetails,
}) {
  // const [truckDetails, setTruckDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");

  // Fetch truck details when modal is opened
  // useEffect(() => {
  //   const fetchTruckDetails = async () => {
  //     if (!truckId) return;
  //     setLoading(true);
  //     try {
  //      await findOne(truckId);
  //       // console.log("truck", response)// Fetch truck details using truckId
  //       // setTruckDetails(response);
  //     } catch (error) {
  //       console.error("Error fetching truck details:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (isOpen) {
  //     fetchTruckDetails();
  //   }
  // }, [isOpen, truckId]);

  const truckDetails = {
    vehicleNumber: "ABC123",
    driverName: "John Doe",
    status: "ARRIVED",
    fromLocation: "Warehouse A",
    toLocation: "Warehouse B",
  };
  const sampleDetails = [
    { value: 120 },
    { value: 150 },
    { value: 100 },
    { value: 180 },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Details for Truck</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {/* Truck Details Card */}
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={cardBorderColor}
              borderRadius="md"
              p={4}
              shadow="md"
            >
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Truck Details
              </Text>
              <Text color={textColor} mb={2}>
                Vehicle Number: {truckDetails.vehicleNumber}
              </Text>
              <Text color={textColor} mb={2}>
                Driver Name: {truckDetails.driverName}
              </Text>
              <Text color={textColor} mb={2}>
                Status: {truckDetails.status}
              </Text>
              <Text color={textColor} mb={2}>
                From Location: {truckDetails.fromLocation}
              </Text>
              <Text color={textColor} mb={2}>
                To Location: {truckDetails.toLocation}
              </Text>
            </Box>

            {/* Sample Details Card */}
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={cardBorderColor}
              borderRadius="md"
              p={4}
              shadow="md"
            >
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Sample Details
              </Text>
              {sampleDetails.length > 0 ? (
                sampleDetails.map((sample, index) => (
                  <Flex
                    key={index}
                    justify="space-between"
                    borderBottom="1px solid"
                    borderColor={cardBorderColor}
                    py={2}
                  >
                    <Text color={textColor}>Value {index + 1}</Text>
                    <Text color={textColor}>{sample.value}</Text>
                  </Flex>
                ))
              ) : (
                <Text color={textColor}>No samples available.</Text>
              )}

              {/* Optional Chart */}
              <Box mt={4}>
                <BarChart
                  chartData={[
                    {
                      name: "Sample Values",
                      data: sampleDetails.map((sample) => sample.value || 0),
                    },
                  ]}
                  chartOptions={{
                    chart: {
                      type: "bar",
                    },
                    xaxis: {
                      categories: sampleDetails.map(
                        (_, index) => `Value ${index + 1}`
                      ),
                    },
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
