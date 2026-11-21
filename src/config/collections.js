import { getDB } from "./db.js";

export const usersCol = () => getDB().collection("users");
export const tuitionsCol = () => getDB().collection("tuitions");
export const applicationsCol = () => getDB().collection("applications");
export const paymentsCol = () => getDB().collection("payments");