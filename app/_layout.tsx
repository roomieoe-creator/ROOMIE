import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(main)/homePage" as never);
      } else {
        router.replace("/welcome" as never);
      }
    });

    return unsubscribe;
  }, [router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
