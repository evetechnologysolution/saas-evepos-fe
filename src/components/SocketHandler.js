import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
// @mui
import { Link } from "@mui/material";
import Iconify from "./Iconify";
import { IconButtonAnimate } from "./animate";
// hooks
import useAuth from "../hooks/useAuth";
// routes
import { PATH_DASHBOARD } from "../routes/paths";
// context
import { mainContext } from "../contexts/MainContext";
import { cashierContext } from "../contexts/CashierContext";
// sound
import waitersAudio from "../assets/sounds/waiters.mp3";
import productionAudio from "../assets/sounds/kitchen-bar.mp3";

export default function SocketHandler() {
    const ctx = useContext(mainContext);
    const ctc = useContext(cashierContext);

    const navigate = useNavigate();

    const { user } = useAuth();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const waitersPlayer = new Audio(waitersAudio);
    const productionPlayer = new Audio(productionAudio);

    const [socketValue, setSocketValue] = useState(null)

    const connectSocket = () => {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL.replace("/api", ""));

        setSocketValue(newSocket);
        ctx.setSocket(newSocket);
        return newSocket;
    };

    const startSocket = () => {
        const currentSocket = socketValue || connectSocket();

        return currentSocket;
    };

    useEffect(() => {
        const currentSocket = startSocket();

        return () => {
            currentSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socketValue) return;

        const reconnectInterval = setInterval(() => {
            if (socketValue?.disconnected) {
                // console.log("Trying to reconnect WebSocket...");
                startSocket();
            }
        }, 5000); // Interval untuk mencoba merekoneksikan (dalam milidetik)

        return () => {
            clearInterval(reconnectInterval);
        };
    }, [socketValue]);

    useEffect(() => {
        if (!ctx.socket) return;

        ctx.socket?.on("receiveKitchen", (data) => {
            if (data?.step === 1) { // for default step = 1 after create order, this order into expo production
                ctx.setKitchenProduction(current => [...current, data]);
                productionPlayer.play();
            }
            if (data?.step === 2) { // for default step = 2 after create order, this order into expo kitchen
                ctx.setKitchenExpoKitchen(current => [...current, data]);
                productionPlayer.play();
            }
            if (data?.new?.step === 2) { // to expo kitchen
                ctx.setKitchenExpoKitchen(current => [...current, data?.new]);
                ctx.setKitchenProduction(data?.updated);
            }
            if (data?.new?.step === 3) { // to expo waiters
                ctx.setKitchenExpoWaiters(current => [...current, data?.new]);
                if (data?.new?.productionDate === data?.new?.kitchenDate) {
                    ctx.setKitchenProduction(data?.updated);
                } else {
                    ctx.setKitchenExpoKitchen(data?.updated);
                }
            }
            if (data?.new?.step === 0) { // done
                ctx.setKitchenExpoWaiters(data?.updated);
            }
            if (data?.step === -1) { // cancel order
                if (data?.production) {
                    ctx.setKitchenProduction(data?.production);
                }
                if (data?.expoKitchen) {
                    ctx.setKitchenExpoKitchen(data?.expoKitchen);
                }
                if (data?.expoWaiters) {
                    ctx.setKitchenExpoWaiters(data?.expoWaiters);
                }
            }

            // trigger for update table in kitchen & bar
            if (data?.action === "update-table") {
                ctx.getKitchen();
                ctx.getBar();
            }
            // trigger for undo in kitchen
            if (data?.action === "undo") {
                ctx.getKitchen();
            }
        });

        ctx.socket?.on("receiveBar", (data) => {
            if (data?.step === 1) {
                ctx.setBarProduction(current => [...current, data]);
                productionPlayer.play();
            }
            if (data?.new?.step === 2) { // to expo waiters
                ctx.setBarExpoWaiters(current => [...current, data?.new]);
                ctx.setBarProduction(data?.updated);
            }
            if (data?.new?.step === 0) { // done
                ctx.setBarExpoWaiters(data?.updated);
            }
            if (data?.step === -1) { // cancel order
                if (data?.production) {
                    ctx.setBarProduction(data?.production);
                }
                if (data?.expoWaiters) {
                    ctx.setBarExpoWaiters(data?.expoWaiters);
                }
            }

            // trigger for undo in bar
            if (data?.action === "undo") {
                ctx.getBar();
            }
        });

        if (user?.role === "Cashier" || user?.role === "Staff") {
            ctx.socket?.on("receiveWaiters", (data) => {
                enqueueSnackbar(
                    data.message,
                    {
                        variant: "info",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right"
                        },
                        persist: true,
                        preventDuplicate: false,

                    }
                );
                waitersPlayer.play();
            });

            ctx.socket?.on("receiveOrder", (data) => {
                ctc.getOrders();
                enqueueSnackbar(
                    data.message,
                    {
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right"
                        },
                        persist: true,
                        preventDuplicate: false,
                        action: (key) => (
                            <>
                                <Link
                                    component="button"
                                    variant="inherit"
                                    underline="hover"
                                    onClick={() => {
                                        navigate(PATH_DASHBOARD.cashier.orders);
                                        closeSnackbar(key);
                                    }}
                                >
                                    Show Detail
                                </Link>
                                <IconButtonAnimate size="small" onClick={() => closeSnackbar(key)} sx={{ p: 0.5 }}>
                                    <Iconify icon={"eva:close-fill"} />
                                </IconButtonAnimate>
                            </>
                        )
                    }
                );
            });
        }

        return () => {
            ctx.socket?.off("receiveKitchen");
            ctx.socket?.off("receiveBar");
            if (user?.role === "Cashier" || user?.role === "Staff") {
                ctx.socket?.off("receiveWaiters");
                ctx.socket?.off("receiveOrder");
            }
        };
    }, [ctx.socket, user]);

    return null;
}