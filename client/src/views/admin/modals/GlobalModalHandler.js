import React, { useState, useEffect } from "react";
import { useSocket } from "contexts/SocketContext";
import WeightModal from "./samplerModal/index"; 
import { TruckArrivalModal } from "./truckModal";
import { useHasRole } from "utils/helper";
import { QAModal } from "./qaModal/index";
import events from "../../../events/events.json";
import BarcodeGenerator from "components/barcode/BarcodeGenerator";
const GlobalModalHandler = () => {
  const socket = useSocket();
  const [isSamplerModalOpen, setIsSamplerModalOpen] = useState(false);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(null); 
  const [truckId, setTruckId] = useState(null); 
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  // const [isTruckAiModalOpen, setIsTruckAiModalOpen] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [qaData, setQaData] = useState({
    // truckId: '',
    // employeeName: '',
    // commodity: '',
    // overallLook: '',
    // broken: 0,
    // innerBroken: 0,
    // recheckBroken: 0,
    // broken_B3: 0,
    // damage: 0,
    // damageBroken: 0,
    // innerDamage: 0,
    // ARVMoisture: 0,
    // innerMoisture: 0,
    // recheckMoisture: 0,
    // chalky: 0,
    // chobba_or_redish: 0,
    // underMilled: 0,
    innerUnderMilled: '',
    shaded: '',
    ponia: '',
    shortGrain: '',
    shirvelledGrain: '',
    minxing: '',
    greenGrain: '',
    polish: 0,
    paddy: 0,
    innerPaddy: 0,
    stone: '',
    // analysisBy: '',
    // imageByAI: '',
  });
  // const isRegisterar = useHasRole("registerar");
  const isRegisterar = useHasRole("registerar");
  const isGatekeeper = useHasRole("gate-keeper");
  // const isSampler = useHasRole("user");
  // const isQa = useHasRole("qaa");
  // console.log("isSampler",isSampler)
  // console.log("isQa",isQa)
  const isQa = useHasRole("qa");
  
  // const isQa = true;

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(events.enter_truck_number, (payload) => {
      // console.log("Event listened: New Truck arrived with payload", payload.vehicleNumber);
      if (isRegisterar) {
        setVehicleNumber(payload.vehicleNumber); 
        setIsTruckModalOpen(true);
      }
    });

    socket.on(events.register_truck, (data) => {
      // console.log("Event listened: Truck registered", data);
    
      if (isQa) {
        setTruckId(data.id)
        setIsSamplerModalOpen(true);
      }
    });

    socket.on(events.qaFormEvent, (data) => {
      // console.log("Event listened: Sample check", data);
      if (isQa) {
        setQaData(data|| {});
        setIsQAModalOpen(true);
      }
    });

    socket.on(events.barcode_Event, (payload) => {
      // console.log("Event listened: Barcode status", payload);
      if(isGatekeeper){
        if (payload.sampleStatus === "PASSED") {
          const { truckId, timestamp, sampleStatus } = payload;
          // console.log("Printing barcode for truckId: ", truckId);
          setBarcodeData({ truckId, timestamp, sampleStatus });
          setShowBarcode(true);
        }
      }
      
    });

    return () => {
      socket.off(events.register_truck);
      socket.off(events.qaFormEvent);
      socket.off(events.barcode_Event);
      socket.off(events.enter_truck_number)
    };
  }, [socket, isQa, isRegisterar, isGatekeeper]);

  const closeSamplerModal = () => setIsSamplerModalOpen(false);
  const closeTruckArrivalModal = () => setIsTruckModalOpen(false);
  const closeQAModal = () => setIsQAModalOpen(false);

  return (
    <>
      {isSamplerModalOpen && <WeightModal truckId={truckId} onClose={closeSamplerModal} />}
      {isTruckModalOpen && <TruckArrivalModal vehicleNumber={vehicleNumber} onClose={closeTruckArrivalModal} />}
      {isQAModalOpen && <QAModal qaFormData={qaData} onClose={closeQAModal} />}
      {showBarcode && <BarcodeGenerator barcodeData={barcodeData} />}
    </>
  );
};

export default GlobalModalHandler;



