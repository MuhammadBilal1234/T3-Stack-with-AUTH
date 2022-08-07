import { getSession, useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Router from "next/router";
import { useEffect } from "react";

const Home: any = () => {
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <Loader size={100} />;
  }

  if (!session) {
    <div>Please Sign In to Continue to Dashboard</div>;
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/Welcome",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Home;
