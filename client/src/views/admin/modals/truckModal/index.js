import React, { useState, useMemo } from "react";
import { createSampleData } from "services/truck";
import events from "../../../../events/events.json";
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Textarea,
  VStack,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  useToast,
  Text,
  ModalFooter,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { useSocket } from "../../../../contexts/SocketContext";

import { create } from "services/truck";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const useTruckFormSchema = () => {
  return useMemo(() => {
    return Yup.object().shape({
      serialNo: Yup.number()
        .required("Serial Number is required")
        .positive("Serial Number must be a positive number")
        .integer("Serial Number must be an integer"),
      vehicleNumber: Yup.string(),
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
  }, []);
};

export const TruckArrivalModal = ({ onClose, vehicleNumber }) => {
  const { t } = useTranslation();
  const truckSchema = useTruckFormSchema();
//   console.log("vn", vehicleNumber);
const initialValues = {
  serialNo: 12345,
  vehicleNumber: vehicleNumber || "ABC-1234",
  truckType: "Container",
  Status: "ARRIVED",
  driverNo: "9876543210",
  brand: "BrandX",
  containerNo: "C123456",
  builtyNo: "B789123",
  sampleRate: 5,
  driverName: "John Doe",
  fromLocation: "City A",
  toLocation: "Wahrehouse A",
};


  const handleSubmit = async (values, { resetForm }) => {
    try {
    //   console.log("Submitting values:", values);
      await create(values);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting truck data:", error);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("global:add")}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={truckSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <ModalBody>
                <VStack spacing={8} align="stretch">
                <SimpleGrid minChildWidth="350px" spacing={6}>
                  <FormControl isInvalid={errors.serialNo && touched.serialNo}>
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
                      value={vehicleNumber}
                      readOnly
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

                  <FormControl isInvalid={errors.driverNo && touched.driverNo}>
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

                  <FormControl isInvalid={errors.builtyNo && touched.builtyNo}>
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
                      type="number"
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

                  <FormControl
                    isInvalid={errors.toLocation && touched.toLocation}
                  >
                    <FormLabel>{t("truck:crudForm:toLocation")}</FormLabel>
                    <Field
                      as={Select}
                      name="toLocation"
                      placeholder={t("truck:crudForm:toLocation")}
                    >
                      <option value="Wahrehouse A">WareHouse A</option>
                      <option value="WareHouse B">WareHouse B</option>
                    </Field>
                    {errors.toLocation && touched.toLocation && (
                      <Text color="red.500">{errors.toLocation}</Text>
                    )}
                  </FormControl>
                  </SimpleGrid>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" variant="darkBrand" color="white">
                  {t("global:add")}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  {t("global:cancel")}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
