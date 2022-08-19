import { getSession, useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import { GetServerSideProps } from "next";
import Link from "next/link";

const Home: any = () => {
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <Loader size={100} />;
  }

  if (!session) {
    return (
      <div>
        Please Sign In to Continue to Dashboard
        <Link href="/auth/signin">SignIn</Link>
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};

export default Home;
