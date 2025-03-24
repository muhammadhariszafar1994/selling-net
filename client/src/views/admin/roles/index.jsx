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
  Checkbox,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { MdOutlinePerson } from "react-icons/md";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAll, create, update, remove } from "services/role";
import Table from "./../../../components/table/Table";
import { findAll as findPermissions } from "services/permissions";

const useRoleFormSchema = () => {
  return useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Role name is required"),
      permissions: Yup.array()
        .of(Yup.string())
        .min(1, "At least one permission is required"),
    });
  }, []);
};

export default function Role() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", permissions: [] });

  const roles = useSelector((state) => state.role.roles);
  const permissions = useSelector((state) => state.permission.permissions);
  const query = useSelector((state) => state.search.query);
  const { t } = useTranslation();

  const roleSchema = useRoleFormSchema();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues({ name: "", permissions: [] })
  };

  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);

  const menusData = [
    { title: t("roles:createRole"), icon: MdOutlinePerson, action: onOpen },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    const roleData = {
      name: values.name,
      permissions: values.permissions,
    };

    if (selectedId) {
      await update(selectedId, roleData);
    } else {
      await create(roleData);
    }

    resetForm();
    setSelectedId(null);
    onClose();
    findAll();
  };

  useEffect(() => {
    findAll();
  }, []);

  const handleUpdateClick = (role) => {
    setSelectedId(role?._id);
    setFormValues({
      name: role?.name,
      permissions: role?.permissions?.map((p) => p.id) || [],
    });
    onOpen();
  };

  const handleRemove = async () => {
    if (selectedId) {
      await remove(selectedId);
      onConfirmClose();
      findAll();
    }
  };

  const handleRemoveClick = (role) => {
    setSelectedId(role?._id);
    onConfirmOpen();
  };

  useEffect(() => {
    isOpen && findPermissions();
    const allPermissions = findPermissions();
    // console.log("permissions in users", allPermissions);
  }, [isOpen]);

  const filteredRoles = useMemo(() => {
    if (!query) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [roles, query]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <Table
          columnsData={t("roles:columnsData", { returnObjects: true })}
          tableData={filteredRoles}
          headingData={"Role Listing"}
          onUpdate={handleUpdateClick}
          onDelete={handleRemoveClick}
          menusData={menusData}
        />
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={formValues}
          validationSchema={roleSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <ModalContent>
                <ModalHeader>
                  {selectedId ? t("global:update") : t("global:add")}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    {/* Role Name Field */}
                    <FormControl isInvalid={errors.name && touched.name}>
                      <FormLabel>{t("roles:crudForm:name")}</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        placeholder={t("roles:crudForm:name")}
                      />
                      {errors.name && touched.name && (
                        <Text color="red.500">{errors.name}</Text>
                      )}
                    </FormControl>

                    {/* Permissions Checklist */}
                    <FormControl
                      isInvalid={errors.permissions && touched.permissions}
                    >
                      <FormLabel>{t("permission:crudForm:name")}</FormLabel>
                      <VStack align="start">
                        {permissions.map((permission) => (
                          <Checkbox
                            key={permission.id}
                            isChecked={(values.permissions || []).includes(
                              permission.id
                            )}
                            onChange={(e) => {
                              const updatedPermissions = e.target.checked
                                ? [...(values.permissions || []), permission.id]
                                : (values.permissions || []).filter(
                                    (id) => id !== permission.id
                                  );
                              setFieldValue("permissions", updatedPermissions);
                            }}
                          >
                            {permission.name}
                          </Checkbox>
                        ))}
                      </VStack>
                      {errors.permissions && touched.permissions && (
                        <Text color="red.500">{errors.permissions}</Text>
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
