// src/components/AddressAutocomplete.js
import React, { useState, useRef } from "react";
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

const AddressAutocomplete = ({ onAddressSelect, existingMarkers }) => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const [cursor, setCursor] = useState("default");

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

  const handleMapClick = (event) => {
    console.log("Address: ", event);
    const address = event.formattedAddress;
    const placeId = event.placeId;
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    setLocation({ lat: latitude, lng: longitude });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      {
        formattedAddress: address,
        placeId: placeId,
        location: { lat: latitude, lng: longitude },
      },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          onAddressSelect({
            formattedAddress,
            placeId: null,
            latitude,
            longitude,
          });
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  };

  const handleMarkerClick = (marker) => {
    setAddress(marker.formattedAddress);
    setLocation({ lat: marker.lat, lng: marker.lng });
    onAddressSelect({
      formattedAddress: marker.formattedAddress,
      placeId: marker.placeId,
      latitude: marker.lat,
      longitude: marker.lng,
    });
  };

  const handleDrag = () => {
    setCursor("grabbing");
  };

  const handleDragEnd = () => {
    setCursor("default");
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
      {location ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          center={location}
          zoom={15}
          onClick={handleMapClick}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          options={{
            draggableCursor: cursor,
            draggingCursor: "grabbing",
          }}
        >
          <Marker
            position={location}
            draggable={true}
            onDragEnd={handleMapClick}
          />
          {existingMarkers.length > 0
            ? existingMarkers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(marker)}
                />
              ))
            : ""}
        </GoogleMap>
      ) : (
        ""
      )}
    </LoadScript>
  );
};

export default AddressAutocomplete;
