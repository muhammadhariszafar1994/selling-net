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
  Text,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { MdOutlinePerson } from "react-icons/md";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAllSamples, create, update, remove } from "services/truck";
import Table from "./../../../components/table/Table";

const useSampleFormSchema = () => {
  return useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("sample name is required"),
    });
  }, []);
};

export default function Sample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState({ name: "" });

  const { samples } = useSelector((state) => state.sample);
  const { t } = useTranslation();

  const sampleSchema = useSampleFormSchema();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues({ name: "" });
  };

  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);

//   const menusData = [
//     {
//       title: t("permission:createPermission"),
//       icon: MdOutlinePerson,
//       action: onOpen,
//     },
//   ];

//   const handleSubmit = async (values, { resetForm }) => {
//     if (selectedId) {
//       await update(selectedId, values);
//     } else {
//       await create(values);
//     }
//     resetForm();
//     setSelectedId(null);
//     onClose();
//     findAllSamples();
//   };

  useEffect(() => {
    findAllSamples();
  }, []);

//   const handleUpdateClick = (Permission) => {
//     setSelectedId(Permission?._id);
//     setFormValues({ name: Permission?.name });
//     onOpen();
//   };

//   const handleRemove = async () => {
//     if (selectedId) {
//       await remove(selectedId);
//       onConfirmClose();
//       findAll();
//     }
//   };

//   const handleRemoveClick = (role) => {
//     setSelectedId(role?._id);
//     onConfirmOpen();
//   };

//   useEffect(() => {
//     // console.log(permissions)
//   }, [permissions]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <Table
          columnsData={t("sample:columnsData", { returnObjects: true })}
          tableData={samples}
          headingData={"samples Listing"}
        //   onUpdate={handleUpdateClick}
        //   onDelete={handleRemoveClick}
        //   menusData={menusData}
        />
      </SimpleGrid>

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={formValues}
          validationSchema={permissionSchema}
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
                    <FormControl isInvalid={errors.name && touched.name}>
                      <FormLabel>{t("permission:crudForm:name")}</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        placeholder={t("permission:crudForm:name")}
                      />
                      {errors.name && touched.name && (
                        <Text color="red.500">{errors.name}</Text>
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
      </Modal> */}
    </Box>
  );
}
