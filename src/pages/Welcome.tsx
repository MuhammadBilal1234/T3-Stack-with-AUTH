import { trpc } from "../utils/trpc";
import { CustomNextPageAuth } from "../types/next-auth";
import { Loader, Pagination } from "@mantine/core";
import Link from "next/link";
import Router from "next/router";
import { Table } from "@mantine/core";
import { useState } from "react";

const PAGE_SIZE = 2;

const Home: CustomNextPageAuth = () => {
  const [page, setPage] = useState(1);
  const utils = trpc.useContext();
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = trpc.useQuery(
    ["question.getPosts", { page: page - 1, pageSize: PAGE_SIZE }],
    { keepPreviousData: true }
  );

  const { mutate: deletePost } = trpc.useMutation(["question.deletePosts"], {
    onSuccess: () => {
      utils.invalidateQueries(["question.getPosts"]);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const handleDeletePost = (id: string) => {
    deletePost(id);
  };

  if (posts?.data && posts?.data?.length > 0) {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Author Id</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {posts.data.map((item) => {
              return (
                <tr key={item.id} className="bg-red-200 cursor-pointer">
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td> {item.author}</td>
                  <td className="py-2 px-2  flex  justify-between">
                    <div
                      className="bg-red-700"
                      onClick={() => handleDeletePost(item.id)}
                    >
                      X
                    </div>
                    <div
                      onClick={() => {
                        Router.push(`/createPost/${item.id}`);
                      }}
                      className="bg-green-500"
                    >
                      Edit Post
                    </div>
                  </td>
                </tr>
              );
            })}
            <Pagination
              total={Math.round(posts.totalCount / PAGE_SIZE)}
              onChange={setPage}
            />
          </tbody>
        </Table>
        <div className="flex justify-center items-center px-5 py-5 bg-red-500 cursor-pointer">
          <Link href="/createPost/new">Create Post</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        You Don't have Any Posts <Link href="/createPost/new">Create Post</Link>
      </div>
    );
  }
};

Home.auth = true;
export default Home;
