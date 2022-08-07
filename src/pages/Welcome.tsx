import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  console.log(session);

  return <h1>Welcome home</h1>;
};

Home.auth = true;
export default Home;
