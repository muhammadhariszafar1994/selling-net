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
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { LanguageData } from "./variables/languageData";
import Table from "./../../../components/table/Table";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import { findAll, create, update, remove } from "services/user";
// import { signup as create } from "services/auth";
import { findAll as findRoles } from "services/role";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MdOutlinePerson } from "react-icons/md";

const useUserFormSchema = (selectedId) => {
  return useMemo(() => {
    const schemaShape = {
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be a positive number")
        .integer("Age must be an integer"),
      gender: Yup.string()
        .oneOf(["male", "female", "other"], "Invalid gender")
        .required("Gender is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: selectedId
        ? Yup.string().optional()
        : Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must be numeric")
        .optional(),
      address: Yup.string().optional(),
      image: selectedId ? Yup.mixed().optional() : null,
      // : Yup.mixed().required("Image is required"),
      roles: Yup.array()
        .of(Yup.string().required("Each role must be a valid string"))
        .required("Roles are required"),
      // roles: Yup.array()
      //   .of(Yup.string().required("Each role must be a valid string"))
      //   // .min(1, "At least one role is required")
      //   .required("Roles are required"),
    };

    return Yup.object().shape(schemaShape);
  }, [selectedId]);
};

export default function User() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    image: "",
    roles: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const { users, token } = useSelector((state) => state.user);
  const roles = useSelector((state) => state.role.roles);
  // const roleNames = roles.map((role) => role.name)
  
  
  const query = useSelector((state) => state.search.query);
  // console.log("all roles",roles)
  const { t } = useTranslation();

  const userSchema = useUserFormSchema(selectedId);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setFormValues({
      firstname: "",
      lastname: "",
      age: "",
      gender: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      image: "",
      roles: [],
    });
    setSelectedImage(null);
  };

  const onConfirmOpen = () => setIsConfirmOpen(true);
  const onConfirmClose = () => setIsConfirmOpen(false);

  const menusData = [
    { title: t("user:createUser"), icon: MdOutlinePerson, action: onOpen },
  ];

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setFormValues((prev) => ({
        //   ...prev,
        //   image: reader.result,
        // }));

        setFieldValue("image", reader.result);
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (key === "image" && values.image) {
          const blob = dataURLtoBlob(values.image);
          formData.append("image", blob, "filename.jpg");
        } else if (key === "roles") {
          values[key].forEach((role) => formData.append("roles[]", role));
        } else {
          formData.append(key, values[key]);
        }
      }
    }

    if (selectedId) await update(selectedId, formData);
    else await create(formData);

    console.log("values", values);
    resetForm();
    setSelectedId(null);
    setSelectedImage(null);
    onClose();
    findAll();
  };

  const handleRemove = async () => {
    if (selectedId) {
      await remove(selectedId);
      onConfirmClose();
    }

    await findAll();
  };

  
  const handleRemoveClick = async (object) => {
    setSelectedId(object?._id);
    onConfirmOpen();
  };

  const handleUpdateClick = (object) => {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const item = object[key];
        if (formValues.hasOwnProperty(key)) {
          if (key === "roles") {
            setFormValues((prev) => ({
              ...prev,
              roles: item.map((role) => role._id),
            }));
          } else if (key !== "image") {
            setFormValues((prev) => ({
              ...prev,
              [key]: item,
            }));
          } else {
            if (item)
              setSelectedImage(process.env.REACT_APP_API_URL + "/" + item);
          }
        }
      }
    }
    setSelectedId(object?._id);
    onOpen();
  };



  const filteredUsers = useMemo(() => {
    if (!query) return users; 
    // console.log("users", users);

    return users.filter((user) => {
      // console.log("user", user);
      return (
        (user.firstname && user.firstname.includes(query)) ||
        (user.lastname && user.lastname.includes(query)) ||
        (user.age && user.age.toString().includes(query)) ||
        (user.gender && user.gender.includes(query)) ||
        (user.email && user.email.includes(query)) ||
        (user.phone && user.phone.includes(query)) ||
        (user.address && user.address.includes(query)) ||
        (Array.isArray(user.roles) && 
        user.roles.some((role) => role.name && role.name.includes(query)))
      );
    });
  }, [users, query]);

  useEffect(() => {
    findAll();
  }, []);

  useEffect(() => {
   
    isOpen && findRoles();
  }, [isOpen]);

  const roleNames = useMemo(() => {
    const rolesSet = new Set();
    users.forEach((user) => {
      user.roles.forEach((role) => {
        if (role.name) {
          rolesSet.add(role.name);
        }
      });
    });
    return Array.from(rolesSet); 
  }, [users]);
  
  const userFilterOptions = {
    Role: roleNames
  };

  console.log(`roles: ${roleNames}`);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <Table
          columnsData={t("user:columnsData", { returnObjects: true })}
          tableData={filteredUsers}
          headingData={"User Listing"}
          onUpdate={handleUpdateClick}
          onDelete={handleRemoveClick}
          menusData={menusData}
          filterOptions={userFilterOptions}
        />
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={formValues}
          validationSchema={userSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <ModalContent>
                <ModalHeader>
                  {selectedId ? t("global:update") : t("global:add")}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    {/* First Name */}
                    <FormControl
                      isInvalid={errors.firstname && touched.firstname}
                    >
                      <FormLabel>{t("user:crudForm:firstname")}</FormLabel>
                      <Field
                        as={Input}
                        name="firstname"
                        placeholder={t("user:crudForm:firstname")}
                      />
                      {errors.firstname && touched.firstname && (
                        <Text color="red.500">{errors.firstname}</Text>
                      )}
                    </FormControl>

                    {/* Last Name */}
                    <FormControl
                      isInvalid={errors.lastname && touched.lastname}
                    >
                      <FormLabel>{t("user:crudForm:lastname")}</FormLabel>
                      <Field
                        as={Input}
                        name="lastname"
                        placeholder={t("user:crudForm:lastname")}
                      />
                      {errors.lastname && touched.lastname && (
                        <Text color="red.500">{errors.lastname}</Text>
                      )}
                    </FormControl>

                    {/* Age */}
                    <FormControl isInvalid={errors.age && touched.age}>
                      <FormLabel>{t("user:crudForm:age")}</FormLabel>
                      <Field
                        as={Input}
                        name="age"
                        type="number"
                        placeholder={t("user:crudForm:age")}
                      />
                      {errors.age && touched.age && (
                        <Text color="red.500">{errors.age}</Text>
                      )}
                    </FormControl>

                    {/* Gender */}
                    <FormControl isInvalid={errors.gender && touched.gender}>
                      <FormLabel>{t("user:crudForm:gender")}</FormLabel>
                      <Field
                        as={Select}
                        name="gender"
                        placeholder={t("user:crudForm:gender")}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      {errors.gender && touched.gender && (
                        <Text color="red.500">{errors.gender}</Text>
                      )}
                    </FormControl>

                    {/* Email */}
                    <FormControl isInvalid={errors.email && touched.email}>
                      <FormLabel>{t("user:crudForm:email")}</FormLabel>
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        placeholder={t("user:crudForm:email")}
                      />
                      {errors.email && touched.email && (
                        <Text color="red.500">{errors.email}</Text>
                      )}
                    </FormControl>

                    {/* Password */}
                    {!selectedId && (
                      <FormControl
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel>{t("user:crudForm:password")}</FormLabel>
                        <Field
                          as={Input}
                          name="password"
                          type="password"
                          placeholder={t("user:crudForm:password")}
                        />
                        {errors.password && touched.password && (
                          <Text color="red.500">{errors.password}</Text>
                        )}
                      </FormControl>
                    )}

                    {/* Phone (optional) */}
                    <FormControl isInvalid={errors.phone && touched.phone}>
                      <FormLabel>{t("user:crudForm:phone")}</FormLabel>
                      <Field
                        as={Input}
                        name="phone"
                        placeholder={t("user:crudForm:phone")}
                      />
                      {errors.phone && touched.phone && (
                        <Text color="red.500">{errors.phone}</Text>
                      )}
                    </FormControl>

                    {/* Address (optional) */}
                    <FormControl isInvalid={errors.address && touched.address}>
                      <FormLabel>{t("user:crudForm:address")}</FormLabel>
                      <Field
                        as={Input}
                        name="address"
                        placeholder={t("user:crudForm:address")}
                      />
                      {errors.address && touched.address && (
                        <Text color="red.500">{errors.address}</Text>
                      )}
                    </FormControl>

                    {/* Image Field */}
                    <FormControl isInvalid={errors.image && touched.image}>
                      <FormLabel>{t("user:crudForm:image")}</FormLabel>
                      <input
                        type="file"
                        name="image"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                      {errors.image && touched.image && (
                        <Text color="red.500">{errors.image}</Text>
                      )}

                      {selectedImage && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={selectedImage}
                            alt="Selected"
                            style={{ width: "200px", height: "auto" }}
                          />
                        </div>
                      )}
                    </FormControl>

                    {/* Roles */}

                    <FormControl isInvalid={errors.roles && touched.roles}>
                      <FormLabel>{t("user:crudForm:roles")}</FormLabel>
                      <Field
                        as={Select}
                        name="roles"
                        placeholder={t("user:crudForm:roles")}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions
                          ).map((option) => option.value);
                          setFieldValue("roles", selectedOptions);
                        }}
                      >
                        {roles.map((role) => (
                          <option key={role._id} value={[role.name]}>
                            {/* {console.log([role.name],'ROLE IN REACT')} */}
                            {[...role.name]}
                          </option>
                        ))}
                      </Field>
                      {errors.roles && touched.roles && (
                        <Text color="red.500">{errors.roles}</Text>
                      )}
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="darkBrand"
                    color="white"
                    fontSize="sm"
                    fontWeight="500"
                    borderRadius="70px"
                    px="24px"
                    py="5px"
                  >
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
