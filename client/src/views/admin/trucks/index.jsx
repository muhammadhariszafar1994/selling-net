import * as Yup from "yup";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { findAll, create, update, remove } from "services/truck";
import SamplerDetail from "../sampler/samplerDetail";
// import BarcodeGenerator from "components/barcode/BarcodeGenerator";
import { io } from "socket.io-client";
import {
  Box,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import Table from "./../../../components/table/Table";
import { Formik, Form, Field } from "formik";
import { MdOutlineLocalShipping } from "react-icons/md";

const useTruckFormSchema = (selectedId) => {
  return useMemo(() => {
    return Yup.object().shape({
      serialNo: Yup.number()
        .required("Serial Number is required")
        .positive("Serial Number must be a positive number")
        .integer("Serial Number must be an integer"),
      vehicleNumber: Yup.string().required("Vehicle Number is required"),
      truckType: Yup.string().required("Truck Type is required"),
      Status: Yup.string().required("Status is required"),
      driverNo: Yup.string().required("Driver Number is required"),
      brand: Yup.string().optional(),
      containerNo: Yup.string().optional(),
      builtyNo: Yup.string().optional(),
      sampleRate: Yup.number()
        .optional()
        .positive("Sample Rate must be a positive number"),
      driverName: Yup.string().required("Driver Name is required"),
      fromLocation: Yup.string().required("From Location is required"),
      toLocation: Yup.string().required("To Location is required"),
    });
  }, [selectedId]);
};

export default function Truck() {
  // const socket = io(process.env.REACT_APP_API_URL);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedTruck, setSelectedTruck] = useState(null); 
  const [selectedId, setSelectedId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { trucks } = useSelector((state) => state.truck);
  const query = useSelector((state) => state.search.query);

  const [formValues, setFormValues] = useState({
    serialNo: 0,
    vehicleNumber: "",
    truckType: "",
    Status: "",
    driverNo: "",
    brand: "",
    containerNo: "",
    builtyNo: "",
    sampleRate: 0,
    driverName: "",
    fromLocation: "",
    toLocation: "",
  });

  const { t } = useTranslation();
  const truckSchema = useTruckFormSchema(selectedId);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues({
      serialNo: 0,
      vehicleNumber: "",
      truckType: "",
      Status: "",
      driverNo: "",
      brand: "",
      containerNo: "",
      builtyNo: "",
      sampleRate: 0,
      driverName: "",
      fromLocation: "",
      toLocation: "",
    });
   
  };

  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);

  const menusData = [
    { title: t("truck:createTruck"), icon: MdOutlineLocalShipping, action: onOpen },
  ];

  // useEffect(() => {
  //   socket.on("truck-weight", (data) => {
  //     // console.log("Received new wieght:", data);

  //     setIsOpen(true);
  //   });

  //   return () => {
  //     socket.off("newTruck");
  //     socket.disconnect();
  //   };
  // }, [socket]);
  
  const filterOptions = {
    Status: ["ARRIVED", "DEPARTURED"],
    
    SampleStatus: ["PASSED", "REJECTD"],
    
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Submitting values:", values);
      if (selectedId) {
        await update(selectedId, values);
      } else {
        await create(values);
   
        // socket.emit("newTruck", {
        //   message: "New truck arrived, collect sample.",
        //   truckData: values,
        // });
      }

      resetForm();
      setSelectedId(null);
      onClose();
      findAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      if (selectedId) {
        await remove(selectedId);
        setSelectedId(null);
        onConfirmClose();
        await findAll();
      }
    } catch (error) {
      console.error("Failed to delete truck:", error);
    }
  };
  const handleRemoveClick = (truck) => {
    setSelectedId(truck?._id);
    onConfirmOpen();
  };

  const handleShowSample = (truck) => {
    setSelectedId(truck?._id);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleUpdateClick = (truck) => {
    setFormValues({
      serialNo: Number(truck.serialNo) || 0,
      vehicleNumber: truck.vehicleNumber || "",
      truckType: truck.truckType || "",
      Status: truck.Status || "",
      driverNo: truck.driverNo || "",
      brand: truck.brand || "",
      containerNo: truck.containerNo || "",
      builtyNo: truck.builtyNo || "",
      sampleRate: Number(truck.sampleRate) || 0,
      driverName: truck.driverName || "",
      fromLocation: truck.fromLocation || "",
      toLocation: truck.toLocation || "",
    });
    setSelectedId(truck?._id);
    onOpen();
  };

  // const filterOptions = ["All", "Daily","Yesterday", "Weekly" ,"Monthly"];

  // const filteredTrucks = useMemo(() => {
  //   if (!query) return trucks; 
  
  //   return trucks.filter((truck) => {
  //     return (
  //       (truck.serialNo && String(truck.serialNo).includes(query)) ||
  //       (truck.vehicleNumber && truck.vehicleNumber.includes(query)) ||
  //       (truck.truckType && truck.truckType.includes(query)) ||
  //       (truck.Status && truck.Status.includes(query)) ||
  //       // (truck.driverNo && truck.driverNo.includes(query)) ||
  //       // (truck.containerNo && truck.containerNo.includes(query)) ||
  //       // (truck.builtyNo && truck.builtyNo.includes(query)) ||
  //       (truck.sampleRate && String(truck.sampleRate).includes(query)) || 
  //       (truck.driverName && truck.driverName.includes(query))
  //       // (truck.toLocation && truck.toLocation.includes(query)) || 
  //       // (truck.fromLocation && truck.fromLocation.includes(query))
  //     );
  //   });
  // }, [trucks, query]);
  
  const filteredTrucks = useMemo(() => {
    if (!query) return trucks;

    return trucks.filter((truck) => {
      return (
        (truck.serialNo && String(truck.serialNo).includes(query)) ||
        (truck.vehicleNumber && truck.vehicleNumber.includes(query)) ||
        (truck.truckType && truck.truckType.includes(query)) ||
        (truck.Status && truck.Status.includes(query)) ||
        (truck.sampleRate && String(truck.sampleRate).includes(query)) ||
        (truck.driverName && truck.driverName.includes(query))
      );
    });
  }, [trucks, query]);

  useEffect(() => {
    findAll();

    // return () => socket.disconnect();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <Table
          columnsData={t("truck:columnsData", { returnObjects: true })}
          tableData={filteredTrucks}
          headingData={"Truck Listing"}
          onUpdate={handleUpdateClick}
          onDelete={handleRemoveClick}
          onShow={handleShowSample}
          menusData={menusData}
          filterOptions= {filterOptions}
        />
      </SimpleGrid>

      <SamplerDetail
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        truckId={selectedId}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <Formik
          initialValues={formValues}
          validationSchema={truckSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <ModalContent>
                <ModalHeader>
                  {selectedId ? t("global:update") : t("global:add")}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl
                      isInvalid={errors.serialNo && touched.serialNo}
                    >
                      <FormLabel>{t("truck:crudForm:serialNo")}</FormLabel>
                      <Field
                        as={Input}
                        name="serialNo"
                        type="number"
                        placeholder={t("truck:crudForm:serialNo")}
                      />
                      {errors.serialNo && touched.serialNo && (
                        <Text color="red.500">{errors.serialNo}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.vehicleNumber && touched.vehicleNumber}
                    >
                      <FormLabel>{t("truck:crudForm:vehicleNumber")}</FormLabel>
                      <Field
                        as={Input}
                        name="vehicleNumber"
                        placeholder={t("truck:crudForm:vehicleNumber")}
                      />
                      {errors.vehicleNumber && touched.vehicleNumber && (
                        <Text color="red.500">{errors.vehicleNumber}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.truckType && touched.truckType}
                    >
                      <FormLabel>{t("truck:crudForm:truckType")}</FormLabel>
                      <Field
                        as={Input}
                        name="truckType"
                        placeholder={t("truck:crudForm:truckType")}
                      />
                      {errors.truckType && touched.truckType && (
                        <Text color="red.500">{errors.truckType}</Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.Status && touched.Status}>
                      <FormLabel>{t("truck:crudForm:Status")}</FormLabel>
                      <Field
                        as={Select}
                        name="Status"
                        placeholder={t("truck:crudForm:Status")}
                      >
                        <option value="ARRIVED">Arrival</option>
                        <option value="DEPARTURED">Departure</option>
                      </Field>
                      {errors.Status && touched.Status && (
                        <Text color="red.500">{errors.Status}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.driverNo && touched.driverNo}
                    >
                      <FormLabel>{t("truck:crudForm:driverNo")}</FormLabel>
                      <Field
                        as={Input}
                        name="driverNo"
                        placeholder={t("truck:crudForm:driverNo")}
                      />
                      {errors.driverNo && touched.driverNo && (
                        <Text color="red.500">{errors.driverNo}</Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.brand && touched.brand}>
                      <FormLabel>{t("truck:crudForm:brand")}</FormLabel>
                      <Field
                        as={Input}
                        name="brand"
                        placeholder={t("truck:crudForm:brand")}
                      />
                      {errors.brand && touched.brand && (
                        <Text color="red.500">{errors.brand}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.containerNo && touched.containerNo}
                    >
                      <FormLabel>{t("truck:crudForm:containerNo")}</FormLabel>
                      <Field
                        as={Input}
                        name="containerNo"
                        placeholder={t("truck:crudForm:containerNo")}
                      />
                      {errors.containerNo && touched.containerNo && (
                        <Text color="red.500">{errors.containerNo}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.builtyNo && touched.builtyNo}
                    >
                      <FormLabel>{t("truck:crudForm:builtyNo")}</FormLabel>
                      <Field
                        as={Input}
                        name="builtyNo"
                        placeholder={t("truck:crudForm:builtyNo")}
                      />
                      {errors.builtyNo && touched.builtyNo && (
                        <Text color="red.500">{errors.builtyNo}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.sampleRate && touched.sampleRate}
                    >
                      <FormLabel>{t("truck:crudForm:sampleRate")}</FormLabel>
                      <Field
                        as={Input}
                        name="sampleRate"
                        placeholder={t("truck:crudForm:sampleRate")}
                      />
                      {errors.sampleRate && touched.sampleRate && (
                        <Text color="red.500">{errors.sampleRate}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.driverName && touched.driverName}
                    >
                      <FormLabel>{t("truck:crudForm:driverName")}</FormLabel>
                      <Field
                        as={Input}
                        name="driverName"
                        placeholder={t("truck:crudForm:driverName")}
                      />
                      {errors.driverName && touched.driverName && (
                        <Text color="red.500">{errors.driverName}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.toLocation && touched.toLocation}
                    >
                      <FormLabel>{t("truck:crudForm:toLocation")}</FormLabel>
                      <Field
                        as={Input}
                        name="toLocation"
                        placeholder={t("truck:crudForm:toLocation")}
                      />
                      {errors.toLocation && touched.toLocation && (
                        <Text color="red.500">{errors.toLocation}</Text>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={errors.fromLocation && touched.fromLocation}
                    >
                      <FormLabel>{t("truck:crudForm:fromLocation")}</FormLabel>
                      <Field
                        as={Input}
                        name="fromLocation"
                        placeholder={t("truck:crudForm:fromLocation")}
                      />
                      {errors.fromLocation && touched.fromLocation && (
                        <Text color="red.500">{errors.fromLocation}</Text>
                      )}
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" variant="darkBrand" color="white">
                    {selectedId ? t("global:update") : t("global:add")}
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    {t("global:cancel")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>

     
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("global:confirmDeletion")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t("global:confirmDeletionMessage")}</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={handleRemove}
            >
              {t("global:yes")}
            </Button>
            <Button variant="ghost" onClick={onConfirmClose}>
              {t("global:no")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

     
    </Box>
  );
}
