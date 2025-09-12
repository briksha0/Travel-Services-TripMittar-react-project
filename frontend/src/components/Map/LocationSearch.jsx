// src/components/Map/LocationSearch.jsx
import React, { useEffect, useRef } from "react";

export default function LocationSearch({ onSelect, defaultValue = "", placeholder = "Enter location" }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"], // you can allow "establishment" for places
      componentRestrictions: { country: "in" }, // restrict to India (remove if global)
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onSelect({
          name: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-transparent focus:outline-none"
    />
  );
}
