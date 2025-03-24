import React, { useEffect, useState, useMemo } from "react";
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
  VStack,
  Select,
  FormErrorMessage,
  Checkbox
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Table from "../../../components/table/Table";
import { findAll, create, update, remove } from "services/store";
import { useSelector } from "react-redux";
import { LanguageData } from "./variables/languageData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";

// import { signup as create } from "services/auth";
import { findAll as findRoles } from "services/role";

import { useTranslation } from "react-i18next";
import { MdOutlinePerson } from "react-icons/md";

const initialValues = {
  storeMarketplace: "",
  storeName: "",
  storeUsername: "",
  storeEmail: "",
  storePassword: "",
  syncSwitch: false,
  listingDescriptionTemplate: false,
  storeRedirectUri: "",
  storeShipStationId: "",
  storeAllowedQuantities: { minQuantity: "", maxQuantity: "" },
  apiOAuthToken: { accessToken: "", refreshToken: "" },
  sourcingSetup: { isSourcingActive: false, minProfitMargin: "" },
  marketplaceOptions: {
    optimalPricingWindow: {
      minimumSellerAllowedPricePercent: "",
      maximumSellerAllowedPricePercent: "",
    },
    sellerId: "",
    marketplaceId: "",
    issueLocale: "",
  },
  analyzerConfig: {
    ebayCommissionPercent: "",
    minimumProfitPercent: "",
  },
};

const validationSchema = (isEditMode) => Yup.object().shape({
  storeMarketplace: Yup.string().required("Required"),
  storeName: Yup.string().required("Required"),
  storeUsername: Yup.string().required("Required"),
  storeEmail: Yup.string().email("Invalid email").required("Required"),
  storePassword: isEditMode ? Yup.string().required("Required") : Yup.string(),
  syncSwitch: Yup.boolean(),
  listingDescriptionTemplate: Yup.boolean(),
  storeRedirectUri: Yup.string().url("Invalid URL"),
  // storeShipStationId: Yup.number(),
  // storeAllowedQuantities: Yup.object().shape({
  //   minQuantity: Yup.number().required("Required"),
  //   maxQuantity: Yup.number().required("Required"),
  // }),
  // apiOAuthToken: Yup.object().shape({
  //   accessToken: Yup.string().required("Required"),
  //   refreshToken: Yup.string().required("Required"),
  // }),
  // sourcingSetup: Yup.object().shape({
  //   isSourcingActive: Yup.boolean(),
  //   minProfitMargin: Yup.number().required("Required"),
  // }),
  // marketplaceOptions: Yup.object().shape({
  //   optimalPricingWindow: Yup.object().shape({
  //     minimumSellerAllowedPricePercent: Yup.number().required("Required"),
  //     maximumSellerAllowedPricePercent: Yup.number().required("Required"),
  //   }),
  //   sellerId: Yup.string().required("Required"),
  //   marketplaceId: Yup.string().required("Required"),
  //   issueLocale: Yup.string().required("Required"),
  // }),
  // analyzerConfig: Yup.object().shape({
  //   ebayCommissionPercent: Yup.number().required("Required"),
  //   minimumProfitPercent: Yup.number().required("Required"),
  // }),
});

export default function Store() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);
  const [isEditMode, setIsEditMode] = useState(false);
  const stores = useSelector((state) => state.store.data);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues(initialValues);
    setIsEditMode(false);
  };
  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);
  const menusData = [
    { title: 'Create', icon: MdOutlinePerson, action: onOpen }
  ];

  const handleSubmit = async (values, { resetForm }) => {
    if (selectedId) await update(selectedId, values);
    else await create(values);

    resetForm();
    onClose();
    findAll();
  };

  const handleUpdateClick = (data) => {
    setFormValues(data);
    setSelectedId(data._id);
    setIsEditMode(true);
    onOpen();
  };

  const handleRemoveClick = (data) => {
    setSelectedId(data?._id);
    onConfirmOpen();
  };

  const handleRemove = async () => {
    if (selectedId) {
      await remove(selectedId);
      onConfirmClose();
      findAll();
    }
  };

  useEffect(() => {
    findAll();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <Table
          columnsData={t("store:columnsData", { returnObjects: true })}
          tableData={stores}
          headingData={"User Listing"}
          onUpdate={handleUpdateClick}
          onDelete={handleRemoveClick}
          menusData={menusData}
          // filterOptions={userFilterOptions}
        />
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Store</ModalHeader>
          <ModalBody>
            <Formik initialValues={formValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                
                <Form>
                  {
                    console.log('errors', errors)
                  }
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={errors.storeMarketplace && touched.storeMarketplace}>
                      <FormLabel>Store Marketplace</FormLabel>
                      <Field as={Select} name="storeMarketplace">
                        <option value="">Select Marketplace</option>
                        <option value="ebay">Ebay</option>
                        <option value="amazon">Amazon</option>
                      </Field>
                      <FormErrorMessage>{errors.storeMarketplace}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={errors.storeName && touched.storeName}>
                      <FormLabel>Store Name</FormLabel>
                      <Field as={Input} name="storeName" />
                      <FormErrorMessage>{errors.storeName}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={errors.storeUsername && touched.storeUsername}>
                      <FormLabel>Store Username</FormLabel>
                      <Field as={Input} name="storeUsername" />
                      <FormErrorMessage>{errors.storeUsername}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={errors.storeEmail && touched.storeEmail}>
                      <FormLabel>Store Email</FormLabel>
                      <Field as={Input} type="email" name="storeEmail" />
                      <FormErrorMessage>{errors.storeEmail}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={errors.storePassword && touched.storePassword}>
                      <FormLabel>Store Password</FormLabel>
                      <Field as={Input} type="password" name="storePassword" />
                      <FormErrorMessage>{errors.storePassword}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl className="d-flex">
                      <FormLabel>Sync Switch</FormLabel>
                      <Field as={Checkbox} name="syncSwitch" />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Listing Description Template</FormLabel>
                      <Field as={Checkbox} name="listingDescriptionTemplate" />
                    </FormControl>

                    <FormControl isInvalid={errors.storeRedirectUri && touched.storeRedirectUri}>
                      <FormLabel>Store Redirect Uri</FormLabel>
                      <Field as={Input} name="storeRedirectUri" />
                      <FormErrorMessage>{errors.storeRedirectUri}</FormErrorMessage>
                    </FormControl>
                    
                    <Button type="submit" colorScheme="blue">Submit</Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
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
