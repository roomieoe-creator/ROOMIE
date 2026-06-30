import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function createListing(data: {
  ownerId: string;
  address: string;
  description: string;
  price: number;
  facilities: string[];
  region: string;
  imageUrls: string[]; //want to ensure our images are going to firestore instead of local storage 
}) {
  return addDoc(collection(db, "listings"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "active",
  });
}