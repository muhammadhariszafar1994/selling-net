import React, { useRef, useState, useEffect } from "react";
import Barcode from "react-barcode";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { generateBarcode } from "services/truck";

const BarcodeGenerator = ({ barcodeData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const barcodeRef = useRef(null);
  const [generatedBarcode, setGeneratedBarcode] = useState("");

  
  useEffect(() => {
    const fetchBarcodeData = async () => {
      if (barcodeData) {
        try {
          const payload = {
            truckId: barcodeData.truckId,
            sampleStatus: barcodeData.sampleStatus,
            timestamp: barcodeData.timestamp,
          };

          // console.log("Generating barcode with payload:", payload);
          const response = await generateBarcode(payload);
          const barcodeValue = response?.data?.barCode?.barCode;

          if (barcodeValue) {
            // console.log("value: ", barcodeValue);
            setGeneratedBarcode(barcodeValue);
            onOpen(); 
          } else {
            console.error("No barcode value returned from the API.");
          }
        } catch (error) {
          console.error("Error generating barcode:", error);
        }
      }
    };

    fetchBarcodeData();
  }, [barcodeData, onOpen]);

  
  const handlePrint = () => {
    if (barcodeRef.current) {
      const printContent = barcodeRef.current.innerHTML;

      
      onClose();

      
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        console.error("Print window blocked or failed to open.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: white;
              }
              .barcode-container {
                display: flex;
                justify-content: center;
                align-items: center;
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  return (
    <>
     
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Barcode Preview</ModalHeader>
          <ModalBody>
            <VStack align="center">
              {generatedBarcode && (
                <div ref={barcodeRef}>
                  <Barcode
                    value={generatedBarcode}
                    width={1.5} 
                    height={60} 
                    fontSize={14} 
                  />
                </div>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePrint}>
              Print Barcode
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BarcodeGenerator;
