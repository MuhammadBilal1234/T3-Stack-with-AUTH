import { CustomNextPageAuth } from "../../types/next-auth";
import { trpc } from "../../utils/trpc";
import { useFormik } from "formik";
import Router, { useRouter } from "next/router";
import * as yup from "yup";
import { Button, Notification, TextInput } from "@mantine/core";
import { useEffect } from "react";

const CreatePost: CustomNextPageAuth = () => {
  const router = useRouter();
  const utils = trpc.useContext();

  let postId = router.query["id"];

  const { mutate: createPost, isLoading: createPostLoading } = trpc.useMutation(
    ["question.createPosts"],
    {
      onSuccess: () => {
        utils.invalidateQueries(["question.getPosts"]);
      },
    }
  );

  const { mutate: editPost, isLoading: editPostLaoding } = trpc.useMutation(
    ["question.editPosts"],
    {
      onSuccess: () => {
        utils.invalidateQueries(["question.getPosts"]);
      },
    }
  );

  const { data: singlePost, refetch: getSinglePost } = trpc.useQuery(
    ["question.getSinglePost", typeof postId == "string" ? postId : ""],
    {
      enabled: false,
    }
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required().max(50),
      description: yup.string().required().max(500),
    }),
    onSubmit: async ({ title, description }) => {
      console.log(postId);

      if (postId == "new") {
        createPost({ title, description });
      } else {
        console.log("postId again");
        if (singlePost?.id) {
          editPost({ id: singlePost.id, title, description });
        }
      }

      Router.push("/Welcome");
    },
  });

  useEffect(() => {
    if (postId == "new") return;

    getSinglePost();

    if (singlePost) {
      formik.setFieldValue("title", singlePost?.title, false);
      formik.setFieldValue("description", singlePost?.description, false);
    }
  }, [postId, singlePost]);

  return (
    <div>
      <div className="flex my-6 mx-6 justify-around flex-col sm:flex-row">
        <div className="w-full">
          <TextInput
            placeholder="title"
            name="title"
            label="Title"
            onChange={formik.handleChange}
            value={formik.values.title}
            error={formik.errors.title}
            required
            size="lg"
          />
        </div>
        <div className="w-full pl-0 sm:pl-4">
          <TextInput
            placeholder="description"
            name="description"
            size="lg"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.errors.description}
            required
          />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <Button
          variant="outline"
          color="red"
          disabled={!(formik.isValid && formik.dirty)}
          onClick={() => formik.handleSubmit()}
          loading={createPostLoading || editPostLaoding}
        >
          {postId == "new" ? `Add` : `Edit`}
        </Button>
      </div>
    </div>
  );
};

CreatePost.auth = true;
export default CreatePost;
