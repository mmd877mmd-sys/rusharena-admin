"use client";
import FullScreenMobileMenu from "@/app/component/menu";
import Image from "next/image";
import React from "react";
import MatchCards from "../component/application/match-card";
import { PushNotifications } from "@capacitor/push-notifications";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        // 1️⃣ Request permission
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== "granted") {
          console.log("Push notifications permission denied ❌");
          return;
        }

        // 2️⃣ Register device with FCM
        await PushNotifications.register();

        // 3️⃣ Listen for registration to get FCM token
        PushNotifications.addListener("registration", (token) => {
          console.log("Device token:", token.value);

          // 4️⃣ Subscribe to 'all_users' topic
          fetch(
            `https://iid.googleapis.com/iid/v1/${token.value}/rel/topics/all_users`,
            {
              method: "POST",
              headers: {
                Authorization: process.env.FIREBASE_AUTHORIZATION,
              },
            }
          )
            .then(() => console.log("Subscribed to topic: all_users ✅"))
            .catch((err) => console.error("Topic subscription error:", err));
        });

        // 5️⃣ Handle registration errors
        PushNotifications.addListener("registrationError", (err) => {
          console.error("Push registration error:", err);
        });

        // 6️⃣ Foreground notification received
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            console.log("Notification received (foreground):", notification);
            alert(`Notification: ${notification.title} - ${notification.body}`);
          }
        );

        // 7️⃣ Notification tapped (background)
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {
            console.log("User tapped notification:", notification);
            alert(`Opened notification: ${notification.notification?.title}`);
          }
        );
      } catch (error) {
        console.error("Push notification init error:", error);
      }
    };

    initPushNotifications();
  }, []);
  return (
    <main className="w-full sm:w-3xl m-auto  mb-18">
      <nav className="fixed top-0 left-0 right-0 min-h-[38px] bg-[#0A0020] flex justify-between py-3 px-6 shadow-[0_-1px_10px_rgba(0,0,0,0.4)] z-99">
        {/* Left side: Logo and company name */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={52}
            height={52}
            className="rounded-full"
          />
          <h1 className="font-semibold text-lg text-green-400">Rush Arena</h1>
        </div>

        {/* Right side: Profile section */}
        <div className="flex items-center ">
          <strong className="font-medium text-white"> Admin Panel </strong>
        </div>
      </nav>
      <div className="mt-8"></div>
      <FullScreenMobileMenu />
      <MatchCards />
    </main>
  );
};

export default Dashboard;
