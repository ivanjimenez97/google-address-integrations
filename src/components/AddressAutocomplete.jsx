// src/components/AddressAutocomplete.js
import React, { useState, useRef, useEffect } from "react";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyles = {
  height: "400px",
  width: "100%",
};

const AddressAutocomplete = ({ onAddressSelect }) => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      const formattedAddress = place.formatted_address;
      const placeId = place.place_id;
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      setAddress(formattedAddress);
      setLocation({ lat: latitude, lng: longitude });
      onAddressSelect({ formattedAddress, placeId, latitude, longitude });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full border-indigo-700 border p-2"
        />
      </Autocomplete>
      {location && (
        <GoogleMap
          mapContainerStyles={mapContainerStyles}
          center={location}
          zoom={15}
        >
          <Marker position={location} />
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default AddressAutocomplete;
