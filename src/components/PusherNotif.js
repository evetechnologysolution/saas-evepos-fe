import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { Client as BeamsClient } from "@pusher/push-notifications-web";
import { useSnackbar } from "notistack";
import { useQueryClient } from "react-query";
// hooks
import useAuth from "../hooks/useAuth";

export default function PusherNotif() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const pusherRef = useRef(null);
    // const beamsRef = useRef(null);
    // const beamsStartedRef = useRef(false);

    const allowChatRoles = ["Super Admin", "Admin", "Cashier"];
    const allowOrderRoles = ["Super Admin", "Admin", "Cashier"];

    useEffect(() => {
        if (!user?._id || !user?.role) return;

        /* ===============================
         * 1️⃣ PUSHER CHANNELS (Realtime)
         * =============================== */
        pusherRef.current = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER || "ap1",
        });

        const subscriptions = [
            { channel: "admin-notif", event: "chat-received", roles: allowChatRoles },
            { channel: "admin-notif", event: "order-new", roles: allowOrderRoles },
            { channel: "admin-notif", event: "postcard-new", roles: allowOrderRoles },
        ];

        const boundChannels = [];

        subscriptions.forEach(({ channel, event, roles }) => {
            const subscribedChannel = pusherRef.current.subscribe(channel);

            subscribedChannel.bind(event, (data) => {
                const userRole = user.role.toLowerCase();
                const allowedRoles = (data?.roles || roles).map((r) =>
                    r.toLowerCase()
                );

                if (!allowedRoles.includes(userRole)) return;

                if (channel === "admin-notif") {
                    queryClient.invalidateQueries("allNotif");
                }

                if (event === "chat-received") {
                    queryClient.invalidateQueries("listConversations");
                    queryClient.invalidateQueries("listMessages");
                }

                if (event === "order-new") {
                    queryClient.invalidateQueries("listDeliveryOrders");
                }

                if (event === "postcard-new") {
                    queryClient.invalidateQueries("listPostcard");
                }

                enqueueSnackbar(data.message, {
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    persist: true,
                });
            });

            boundChannels.push(subscribedChannel);
        });

        /* ===============================
         * 2️⃣ PUSHER BEAMS (Push Notif)
         * =============================== */
        // beamsRef.current = new BeamsClient({
        //     instanceId: process.env.REACT_APP_PUSHER_BEAMS_INSTANCE_ID,
        // });

        // const initBeams = async () => {
        //     try {
        //         if (
        //             typeof window === "undefined" ||
        //             !("serviceWorker" in navigator) ||
        //             !("PushManager" in window)
        //         ) {
        //             return;
        //         }

        //         // ⛔ Jangan start dua kali
        //         if (beamsStartedRef.current) return;

        //         // 🔔 Permission handling
        //         if (Notification.permission === "denied") {
        //             console.warn("❌ Notification permission denied");
        //             return;
        //         }

        //         if (Notification.permission !== "granted") {
        //             const permission = await Notification.requestPermission();
        //             if (permission !== "granted") {
        //                 console.warn("❌ User did not grant notification permission");
        //                 return;
        //             }
        //         }

        //         // ⏳ Tunggu SW aktif
        //         await navigator.serviceWorker.ready;

        //         await beamsRef.current.start();
        //         beamsStartedRef.current = true;

        //         const normalize = (v) =>
        //             v?.toLowerCase().replace(/\s+/g, "-");

        //         /**
        //          * 🔑 Interest strategy
        //          * - user-{userId}
        //          * - role-{role}
        //          */
        //         const interests = [
        //             `user-${user._id}`,
        //             `role-${normalize(user.role)}`,
        //         ];

        //         await beamsRef.current.setDeviceInterests(interests);

        //         console.log("✅ Beams subscribed:", interests);
        //     } catch (err) {
        //         console.error("❌ Beams init failed", err);
        //     }
        // };

        // initBeams();

        /* ===============================
         * CLEANUP
         * =============================== */
        return () => {
            // Realtime cleanup
            boundChannels.forEach((ch) => {
                ch.unbind_all();
                pusherRef.current.unsubscribe(ch.name);
            });

            pusherRef.current.disconnect();

            // Beams cleanup
            // if (beamsRef.current && beamsStartedRef.current) {
            //     beamsRef.current.clearDeviceInterests();
            //     beamsStartedRef.current = false;
            // }
        };
    }, [user?._id, user?.role]);

    return null;
}
