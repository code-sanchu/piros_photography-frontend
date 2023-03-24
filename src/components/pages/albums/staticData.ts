import { type GetStaticProps } from "next";

export type StaticData = {
  a: "hello";
};

export const getStaticProps: GetStaticProps<StaticData> = () => {
  return {
    props: {
      a: "hello",
    },
  };
};
