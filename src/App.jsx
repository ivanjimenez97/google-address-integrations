// src/App.js
import React, { useState } from "react";
import AddressAutocomplete from "./components/AddressAutocomplete.jsx";
import axios from "axios";

const App = () => {
  const [addressDetails, setAddressDetails] = useState(null);

  const handleAddressSelect = async ({
    formattedAddress,
    placeId,
    latitude,
    longitude,
  }) => {
    setAddressDetails({
      formattedAddress,
      placeId,
      latitude,
      longitude,
    });
  };

  const handleSaveAddress = async () => {
    if (addressDetails) {
      try {
        await axios.post(`http://google-address-apis.test/api/addresses/save`, {
          formatted_address: addressDetails.formattedAddress,
          place_id: addressDetails.placeId,
          latitude: addressDetails.latitude,
          longitude: addressDetails.longitude,
        });
        alert("Address saved successfully!");
      } catch (error) {
        console.error("Error saving address:", error);
        alert("Failed to save address.");
      }
    }
  };

  return (
    <div className="App container mx-auto px-3">
      <h1 className="text-indigo-700 my-3 font-bold uppercase text-xl xl:text-2xl">
        Address Autocomplete
      </h1>
      <AddressAutocomplete onAddressSelect={handleAddressSelect} />
      {addressDetails && (
        <div className="w-full mt-4">
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-3 rounded-xl">
            <h3 className="text-indigo-600 mb-4 font-semibold">
              Selected Address
            </h3>
            <p className="text-slate-500">
              <strong>Formatted Address: </strong>{" "}
              {addressDetails.formattedAddress}
            </p>
            <p className="text-slate-500">
              <strong>Place ID: </strong> {addressDetails.placeId}
            </p>
            <p className="text-slate-500">
              <strong>Latitude: </strong> {addressDetails.latitude}
            </p>
            <p className="text-slate-500 mb-4">
              <strong>Longitude: </strong> {addressDetails.longitude}
            </p>
            <button
              className="bg-lime-500 text-white hover:bg-white hover:border-2 hover:border-lime-500 hover:text-lime-500 px-4 py-2"
              onClick={handleSaveAddress}
            >
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
