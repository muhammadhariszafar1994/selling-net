import React, { useEffect, useState } from "react";
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
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Table from "../../../components/table/Table";
import { findAll, create, update, remove, generateToken } from "services/marketplace";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MdOutlinePerson } from "react-icons/md";

const validationSchema = Yup.object().shape({
  storeMarketplace: Yup.string().required("Required"),
  clientId: Yup.string().required("Required"),
  clientSecret: Yup.string().required("Required"),
  redirectUri: Yup.string(),
  apiOAuthToken: Yup.string(),
});

const initialValues = {
  storeMarketplace: "",
  clientId: "",
  clientSecret: "",
  redirectUri: "",
  apiOAuthToken: "",
  grant_type: "",
  scope: ""
};

export default function Marketplace() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);
  const marketplaces = useSelector((state) => state.marketplace.data);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues(initialValues);
  };
  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);

  const handleSubmit = async (values, { resetForm }) => {
    if (selectedId) {
      await update(selectedId, values);
    } else {
      await create(values);
    }

    resetForm();
    onClose();
    findAll();
  };

  const handleUpdateClick = (data) => {
    // When updating, set the form values to the existing marketplace data
    setFormValues({
      storeMarketplace: data.storeMarketplace,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      redirectUri: data.redirectUri,
      apiOAuthToken: data.apiOAuthToken || "",
      grant_type: data.grant_type || "",
      scope: data.scope || ""
    });
    setSelectedId(data._id);
    onOpen();
  };

  const handleRemoveClick = (data) => {
    setSelectedId(data._id);
    onConfirmOpen();
  };

  const handleRemove = async () => {
    if (selectedId) {
      await remove(selectedId);
      onConfirmClose();
      findAll();
    }
  };

  const handleGenerate = async () => {
    if (selectedId) {
      const response = await generateToken(selectedId);

      setFormValues((prevValues) => ({
        ...prevValues,
        apiOAuthToken: response?.data?.access_token,
      })); 
    }
  };

  useEffect(() => {
    findAll();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: "20px", xl: "20px" }}>
        <Table
          columnsData={t("marketplace:columnsData", { returnObjects: true })}
          tableData={marketplaces}
          headingData={"Marketplace"}
          onUpdate={handleUpdateClick}
          onDelete={handleRemoveClick}
          menusData={[{ title: "Create", icon: MdOutlinePerson, action: onOpen }]}
        />
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedId ? "Edit Marketplace" : "Create Marketplace"}</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={formValues} // Set the initial values dynamically
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize // This allows Formik to reinitialize when formValues change
            >
              {({ errors, touched }) => (
                <Form>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={errors.storeMarketplace && touched.storeMarketplace}>
                      <FormLabel>Store Marketplace</FormLabel>
                      <Field as={Input} name="storeMarketplace" />
                      <FormErrorMessage>{errors.storeMarketplace}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.clientId && touched.clientId}>
                      <FormLabel>Client ID</FormLabel>
                      <Field as={Input} name="clientId" />
                      <FormErrorMessage>{errors.clientId}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.clientSecret && touched.clientSecret}>
                      <FormLabel>Client Secret</FormLabel>
                      <Field as={Input} name="clientSecret" />
                      <FormErrorMessage>{errors.clientSecret}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.redirectUri && touched.redirectUri}>
                      <FormLabel>Redirect Uri</FormLabel>
                      <Field as={Input} name="redirectUri" />
                      <FormErrorMessage>{errors.redirectUri}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.apiOAuthToken && touched.apiOAuthToken}>
                      <FormLabel>API OAuth Token</FormLabel>
                      
                      <Flex alignItems="center" marginBottom="4">
                        <Box flex="1">
                          <Field as={Input} name="apiOAuthToken" />
                        </Box>
                        <Box marginLeft="2">
                          <Button onClick={handleGenerate} type="button" colorScheme="blue" width="auto">
                            Generate
                          </Button>
                        </Box>
                      </Flex>
                      <FormErrorMessage>{errors.apiOAuthToken}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.grant_type && touched.grant_type}>
                      <FormLabel>Grant Type</FormLabel>
                      <Field as={Input} name="grant_type" />
                      <FormErrorMessage>{errors.grant_type}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.scope && touched.scope}>
                      <FormLabel>Scope</FormLabel>
                      <Field as={Input} name="scope" />
                      <FormErrorMessage>{errors.scope}</FormErrorMessage>
                    </FormControl>

                    <Button type="submit" colorScheme="blue">
                      Save
                    </Button>
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
            <Button colorScheme="red" onClick={handleRemove}>
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
