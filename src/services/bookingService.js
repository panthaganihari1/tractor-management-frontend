import api from "./api";

export const getAllBookings = () =>
  api.get("/bookings");

export const createBooking = (booking) =>
  api.post("/bookings", booking);

export const updatePaymentStatus = (id, paid) =>
  api.put(`/bookings/${id}/payment?paid=${paid}`);

export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`);