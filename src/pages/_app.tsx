import { MantineProvider } from "@mantine/core";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { NotificationsProvider } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <ReactQueryDevtools initialIsOpen />
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <NotificationsProvider position="top-right">
                    <Component {...pageProps} />
                </NotificationsProvider>
            </MantineProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
