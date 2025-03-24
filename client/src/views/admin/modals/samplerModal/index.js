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
import { createRiceImage } from "services/truck";


// weight modal for new truck arrivals

const WeightModal = ({ onClose, truckId }) => {
  const socket = useSocket();
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object().shape({
    riceImage: Yup.mixed()
      .required("Image is required")
      .test(
        "fileSize",
        "File size is too large (max 5MB)",
        (value) => !value || (value && value.size <= 5242880)
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
      ),
  });

  const handleSubmit = async (values) => {
    const fileName = values.riceImage ? values.riceImage.name : null;


    try {
      await createRiceImage({ riceImage: fileName }); 

      socket.emit(events.imageUploaded, {
        message: "Image uploaded successfully",
        data: truckId
      });

      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("global:add")}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ riceImage: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <ModalBody>
                <FormControl isInvalid={errors.riceImage && touched.riceImage}>
                  <FormLabel>{t("sampleData:crudForm:riceImage")}</FormLabel>
                  <Input
                    type="file"
                    name="riceImage"
                    placeholder={t("sampleData:crudForm:riceImage")}
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("riceImage", file);
                      setPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {errors.riceImage && touched.riceImage && (
                    <p style={{ color: "red", marginTop: "5px" }}>
                      {errors.riceImage}
                    </p>
                  )}
                </FormControl>

                {preview && (
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  variant="darkBrand"
                  color="white"
                  isLoading={isSubmitting}
                >
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

export default WeightModal;



