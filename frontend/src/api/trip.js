import API from "./authApi";

// ================= START TRIP =================
export const startTrip = (data) =>
  API.post("/trip/start", data);

// ================= END TRIP =================
export const endTrip = (data) =>
  API.post("/trip/end", data);

// ================= ACTIVE TRIP =================
export const getActiveTrip = (driverId) =>
  API.get(`/trip/active/${driverId}`);

// ================= TRIP HISTORY =================
export const getTripHistory = (driverId) =>
  API.get(`/trip/history/${driverId}`);

// ================= PICKUP =================
export const pickupStudent = (tripId) =>
  API.post(`/trip/pickup/${tripId}`);

// ================= DROP =================
export const dropStudent = (tripId) =>
  API.post(`/trip/drop/${tripId}`);

// ================= MORNING DROP PHOTO =================
export const uploadMorningDropPhoto = (tripId, formData) =>
  API.post(`/trip/morning-drop-photo/${tripId}`, formData);

// ================= AFTERNOON PICKUP PHOTO =================
export const uploadAfternoonPickupPhoto = (tripId, formData) =>
  API.post(`/trip/afternoon-pickup-photo/${tripId}`, formData);