// src/pages/_app.tsx
import React, { ReactHTML, ReactPortal, useEffect } from "react";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import { AppProps } from "next/app";
import superjson from "superjson";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { MantineProvider, Loader, Button } from "@mantine/core";
import "../styles/globals.css";
import type { NextComponentType, NextPageContext } from "next";
import Router from "next/router";

type CustomAppProps = {
  Component: NextComponentType<NextPageContext, any, {}> & { auth?: boolean };
  pageProps: any;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: NextComponentType<NextPageContext, any, {}> & { auth?: boolean };
  pageProps: any;
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={{ loader: "oval" }}>
        {Component?.auth ? (
          <Layout>
            <Auth>
              <Component {...pageProps} />
            </Auth>
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </MantineProvider>
    </SessionProvider>
  );
};

const Header = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="bg-red-400 py-5 flex justify-between items-center px-5">
      <div>{user ? `Welcome ${user.name}` : `SignIn With Github`}</div>
      <div>
        <Button
          variant="outline"
          color="blue"
          radius="md"
          onClick={() => (user ? signOut() : signIn())}
        >
          Sign {user ? `Out` : `In`}
        </Button>
      </div>
    </div>
  );
};

const Layout = ({ children }: React.ReactNode | any) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

const Auth = ({ children }: React.ReactNode | any) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return;

    if (!isUser) Router.push("/Welcome");
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  return <Loader size={50} />;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
