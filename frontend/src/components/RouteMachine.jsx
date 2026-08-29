import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

function RouteMachine({ driver, student, school }) {

  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {

    if (!driver || !student || !school) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(driver[0], driver[1]),
        L.latLng(student[0], student[1]),
        L.latLng(school[0], school[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };

  }, [driver, student, school, map]);

  return null;
}

export default RouteMachine;