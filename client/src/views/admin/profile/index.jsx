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
import { Box, Grid, Avatar } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
  ModalFooter,
  Center,
  Text,
  Select,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "services/user";
import { updateUser } from "../../../store/redux/slices/user";

const dataURLtoBlob = (dataURL) => {
  const [header, base64] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
};

export default function Overview() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFieldValue("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const initialValues = {
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    age: user?.age || 0,
    gender: user?.gender || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // console.log("Form submitted with values:", values);
    const formData = new FormData();

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (key === "image" && values.image) {
          const blob = dataURLtoBlob(values.image);
          formData.append("image", blob, "profile-image.jpg");
        } else {
          formData.append(key, values[key]);
        }
      }
    }

    try {
      const updatedUser = await updateProfile(user.id, formData);

      dispatch(updateUser(updatedUser));
      // console.log("User updated successfully:", updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error);
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message || "Update failed." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (firstname, lastname) => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return `${firstInitial} ${lastInitial}`;
  };

  return (
    <Center
    minH="100vh"
    bg="gray.100"
    p={{ base: 8, md: 8 }} 
  >
    <Box
      maxW="6xl"
      w="100%"
      bg="white"
      p={{ base: 8, md: 8 }} 
      m={{ base: 8, md: 8 }} 
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid #e2e8f0"
      overflow="hidden"
    >
      {/* Avatar with initials */}
      <Center mb={6}>
        <Avatar
          name={getInitials(user.firstname, user.lastname)}
          size="2xl"
          bg="blue.500"
          color="white"
          fontSize="2xl"
        />
      </Center>
  
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (!values.firstname)
            errors.firstname = t("errors:required", { field: "First name" });
          if (!values.lastname)
            errors.lastname = t("errors:required", { field: "Last name" });
          if (!values.age)
            errors.age = t("errors:required", { field: "Age" });
          if (!values.gender)
            errors.gender = t("errors:required", { field: "Gender" });
          if (!values.email)
            errors.email = t("errors:required", { field: "Email" });
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <VStack
              spacing={4}
              align="stretch"
              overflowY={{ base: "scroll", md: "visible" }}
              maxH={{ base: "calc(100vh - 160px)", md: "none" }}
            >
              {/* First Name */}
              <FormControl isInvalid={errors.firstname && touched.firstname}>
                <FormLabel>{t("user:crudForm:firstname")}</FormLabel>
                <Field
                  as={Input}
                  name="firstname"
                  placeholder={t("user:crudForm:firstname")}
                />
                {errors.firstname && touched.firstname && (
                  <Text color="red.500" fontSize="sm">
                    {errors.firstname}
                  </Text>
                )}
              </FormControl>
  
              {/* Last Name */}
              <FormControl isInvalid={errors.lastname && touched.lastname}>
                <FormLabel>{t("user:crudForm:lastname")}</FormLabel>
                <Field
                  as={Input}
                  name="lastname"
                  placeholder={t("user:crudForm:lastname")}
                />
                {errors.lastname && touched.lastname && (
                  <Text color="red.500" fontSize="sm">
                    {errors.lastname}
                  </Text>
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
                  <Text color="red.500" fontSize="sm">
                    {errors.age}
                  </Text>
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
                  <Text color="red.500" fontSize="sm">
                    {errors.gender}
                  </Text>
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
                  disabled
                />
                {errors.email && touched.email && (
                  <Text color="red.500" fontSize="sm">
                    {errors.email}
                  </Text>
                )}
              </FormControl>
  
              {/* Phone */}
              <FormControl isInvalid={errors.phone && touched.phone}>
                <FormLabel>{t("user:crudForm:phone")}</FormLabel>
                <Field
                  as={Input}
                  name="phone"
                  placeholder={t("user:crudForm:phone")}
                />
                {errors.phone && touched.phone && (
                  <Text color="red.500" fontSize="sm">
                    {errors.phone}
                  </Text>
                )}
              </FormControl>
  
              {/* Address */}
              <FormControl isInvalid={errors.address && touched.address}>
                <FormLabel>{t("user:crudForm:address")}</FormLabel>
                <Field
                  as={Input}
                  name="address"
                  placeholder={t("user:crudForm:address")}
                />
                {errors.address && touched.address && (
                  <Text color="red.500" fontSize="sm">
                    {errors.address}
                  </Text>
                )}
              </FormControl>
  
              {/* Profile Picture */}
              <FormControl isInvalid={errors.image && touched.image}>
                <FormLabel>{t("user:crudForm:image")}</FormLabel>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                {errors.image && touched.image && (
                  <Text color="red.500" fontSize="sm">
                    {errors.image}
                  </Text>
                )}
  
                {/* Preview uploaded image */}
                {values.image && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={values.image}
                      alt="Profile"
                      style={{ width: "200px", height: "auto" }}
                    />
                  </div>
                )}
              </FormControl>
  
              <Button
                type="submit"
                variant="solid"
                color="white"
                bg="blue.500"
                fontSize="md"
                fontWeight="500"
                borderRadius="md"
                px="6"
                py="3"
                _hover={{ bg: "blue.600" }}
              >
                {t("global:update")}
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  </Center>
  
  );
}
