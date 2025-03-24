import React from 'react';

import {
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
  VStack,
  Button,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import events from '../../../../events/events.json';
import { useSocket } from "../../../../contexts/SocketContext";
export const QAModal = ({ onClose, qaFormData }) => {
  const { t } = useTranslation();
  const socket = useSocket();

  const handleQAConfirm = () => {
    const status = "PASSED"; 
    const payload = {
      message: "QA Form Submitted",
      status: status,
      data: qaFormData, 
    };
  
    socket.emit(events.qaStatusEvent, payload);
    console.log('QA Form Submitted: PASS, Print Barcode', payload);
    onClose(); 
  };

  const handleQAReject = () => {
    const status = "REJECTED";
    const payload = {
      message: "QA Form Rejected",
      status: status,
      data: qaFormData,
    };

    socket.emit(events.qaStatusEvent, payload);
    console.log('QA Form Submitted: REJECTED', payload);
    onClose(); 
  };

  const filteredData = Object.entries(qaFormData || {}).filter(
    ([key]) => !['__v', '_id', 'createdAt', 'updatedAt', 'truckId'].includes(key)
  );

  return (
    <Modal isOpen={true} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>QA Review Form</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8} align="stretch">
            <SimpleGrid minChildWidth="250px" spacing={6}>
              {filteredData.map(([key, value], index) => (
                <FormControl key={index} isReadOnly>
                  <FormLabel>{t(`qa:crudForm:${key}`) || key}</FormLabel>
                  <Input type="text" value={value} readOnly />
                </FormControl>
              ))}
            </SimpleGrid>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleQAConfirm} leftIcon={<FaCheck />} size="lg" m={4}>
            {t('global:pass')}
          </Button>
          <Button colorScheme="red" onClick={handleQAReject} leftIcon={<FaTimes />} size="lg" m={4}>
            {t('global:reject')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QAModal;
