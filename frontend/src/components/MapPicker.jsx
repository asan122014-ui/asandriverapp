import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const defaultCenter = {
  lat: 17.385,
  lng: 78.4867,
};

export default function MapPicker({ onChange }) {
  const mapRef = useRef(null);
  const searchRef = useRef(null);

  const [marker, setMarker] = useState(defaultCenter);
  const [address, setAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  const center = useMemo(() => marker, [marker]);

  /* ================= CURRENT LOCATION ================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setMarker({ lat, lng });
        reverseGeocode(lat, lng);

        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
      }
    );
  }, []);

  /* ================= REVERSE GEOCODE ================= */

  const reverseGeocode = (lat, lng) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        location: { lat, lng },
      },
      (results, status) => {
        if (status === "OK" && results?.length) {
          const formatted = results[0].formatted_address;

          setAddress(formatted);

          onChange({
            address: formatted,
            latitude: lat,
            longitude: lng,
          });
        }
      }
    );
  };

  /* ================= MAP CLICK ================= */

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });

    reverseGeocode(lat, lng);
  };

  /* ================= MARKER DRAG ================= */

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });

    reverseGeocode(lat, lng);
  };

  /* ================= SEARCH ================= */

  const onPlacesChanged = () => {
    if (!searchRef.current) return;

    const places = searchRef.current.getPlaces?.();

    if (!places || places.length === 0) return;

    const place = places[0];

    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const formatted = place.formatted_address || place.name || "";

    setMarker({ lat, lng });
    setAddress(formatted);

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }

    onChange({
      address: formatted,
      latitude: lat,
      longitude: lng,
    });
  };

  /* ================= WAIT FOR GOOGLE ================= */

  if (!window.google || loadingLocation) {
    return (
      <div className="flex items-center justify-center h-80 rounded-2xl bg-gray-100">
        <p className="text-gray-500">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="font-semibold text-gray-700">
        Select Home Location
      </label>

      <StandaloneSearchBox
        onLoad={(searchBox) => {
          searchRef.current = searchBox;
        }}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search your address..."
          className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "340px",
          borderRadius: "20px",
        }}
        center={center}
        zoom={16}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onClick={onMapClick}
      >
        <Marker
          position={marker}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>

      {address && (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin
              size={18}
              className="text-yellow-600"
            />

            <span className="font-semibold text-yellow-700">
              Selected Location
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-6">
            {address}
          </p>
        </div>
      )}
    </div>
  );
}