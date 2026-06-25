import api from "./api";

export const getAllFarmers = () =>
  api.get("/farmers");

export const createFarmer = (farmer) =>
  api.post("/farmers", farmer);

export const deleteFarmer = (id) =>
  api.delete(`/farmers/${id}`);