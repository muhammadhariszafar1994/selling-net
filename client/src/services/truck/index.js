import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { setAllTrucks, setOneTruck } from "store/redux/slices/truck";
import { setAllBarcodes, setOneBarcode } from "store/redux/slices/barcode";
import { setAllSamples, setOneSample } from "store/redux/slices/sampler";
import { getAuthHeader } from "utils/auth-header";
export const create = async (payload) => {
  await AxiosInstance.post(`/truck/register`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      // console.log(response.data)
    })
    .catch(async () => {});
};

export const findAll = async () => {
  console.log("auth header", getAuthHeader());
  await AxiosInstance.get(`/truck/get-trucks`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      await store.dispatch(setAllTrucks(response.data));
    })
    .catch(async () => {});
};

// export const findOne = async (id) => {
//   try {
//     console.log("idddddddddddddddddddd", id);
//     const response = await AxiosInstance.get(`/truck/get-trucks/${id}`, {
//       headers: getAuthHeader(),
//     });
//     console.log("response", response);
//     // await store.dispatch(setOneTruck(response.data));
//     // return response.data;
//   } catch (error) {
   
    
//   }
// };

export const findOne = async (id) => {
  try {
    console.log("Fetching truck with ID:", id);
    const response = await AxiosInstance.get(`/truck/get-trucks/${id}`, {
      headers: getAuthHeader(),
    });

    console.log("Truck Details Response:", response.data.data);
    // return response; // Return the truck data
  } catch (error) {
    if (error.response) {
      // The server responded with a status code outside the range of 2xx
      console.error("Server Error:", error.response.data);
      console.error("Status Code:", error.response.status);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No Response Received:", error.request);
    } else {
      // Something else happened during the request
      console.error("Error:", error.message);
    }
    throw error; // Rethrow the error to handle it in the calling code
  }
};


export const update = async (id, payload) => {
  await AxiosInstance.put(`/truck/update-trucks/${id}`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};

export const remove = async (id) => {
  await AxiosInstance.delete(`/truck/delete-trucks/${id}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};

export const generateBarcode = async (payload) => {
  try {
    const response = await AxiosInstance.post(`/truck/generate`, payload, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Error generating barcode:", error);
    throw error;
  }
};

export const checkBarcodeExpiration = async (barcodeId) => {
  await AxiosInstance.get(`/truck/barcode-expire/${barcodeId}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      return response.data;
    })
    .catch(async () => {});
};

export const findAllBarcodes = async () => {
  // console.log("auth header", getAuthHeader());
  await AxiosInstance.get(`/truck/get-generate-barcode`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      await store.dispatch(setAllBarcodes(response.data));
    })
    .catch(async () => {});
};

export const findOneBarcode = async (id) => {
  await AxiosInstance.get(`/truck/get-generate-barcode/${id}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      console.log("response data", response.data);
      await store.dispatch(setOneBarcode(response.data));
    })
    .catch(async () => {});
};

export const createSampleData = async (payload) => {
  await AxiosInstance.post(`/truck/create-sampledata`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      // console.log(response.data)
    })
    .catch(async () => {});
};

export const createRiceImage = async (payload) => {
  // console.log("payload", payload)
  await AxiosInstance.post(`/truck/riceImage-save`, payload, {
    headers: getAuthHeader(),
    // {
    //   ...getAuthHeader(),
    //   'Content-Type': 'multipart/form-data',
    // },
  })
    .then(async (response) => {
      // console.log(response.data)
    })
    .catch(async () => {});
};

export const getTotalWeight = async () => {
  try {
    const response = await AxiosInstance.get(`/truck/get-arrival-truckweight`, {
      headers: getAuthHeader(),
    });
    console.log(response.data.data, "response weighted");
    return response.data.data;
  } catch (error) {
    console.error("Error getting weight:", error);
    throw error;
  }
};

export const getSampleReport = async () => {
  try {
    const response = await AxiosInstance.get(`/truck/report`, {
      headers: getAuthHeader(),
    });
    // console.log(response.data.data, "response report")
    return response.data.data;
  } catch (error) {
    console.error("Error getting weight:", error);
    throw error;
  }
};

export const getSampleBay = async () => {
  try {
    const response = await AxiosInstance.get(`/truck/get-samplebay`, {
      headers: getAuthHeader(),
    });
    // console.log(response.data.data.bay, "response report")
    return response.data.data.bay;
  } catch (error) {
    console.error("Error getting weight:", error);
    throw error;
  }
};

export const findAllSamples = async () => {
  console.log("auth header", getAuthHeader());
  await AxiosInstance.get(`/truck/get-sampledata`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      console.log("response data", response.data.data.sample);
      await store.dispatch(setAllSamples(response.data.data.sample));
    })
    .catch(async () => {});
};

export const findOneSample = async (id) => {
  await AxiosInstance.get(`/truck/get-sampledata/${id}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      console.log("response data", response.data.sample);
      await store.dispatch(setOneSample(response.data.sample));
    })
    .catch(async () => {});
};
