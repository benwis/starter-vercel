import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/react";
import { useRouteData } from "@remix-run/react";

import styles from "url:../styles/index.css";
import { GraphQLClient, gql } from "graphql-request";
import { bundleMDX } from "mdx-bundler";
import { MDXProvider } from "@mdx-js/react";
import { getMDXComponent } from "mdx-bundler/client";
import { json } from "@remix-run/data";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader: LoaderFunction = async () => {
  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo
Here's a **neat** demo. Will it bundle on vercel?

`.trim();

  console.log(mdxSource);
  const post = await bundleMDX(mdxSource);

  return json(post, {
    headers: {
      "cache-control": `public, max-age=38400`,
    },
  });
};

function Post({ code, frontmatter }) {
  const Component = getMDXComponent(code);
  return (
    <MDXProvider>
      <Component />
    </MDXProvider>
  );
}
export default function Index() {
  let post = useRouteData();
  const { code, frontmatter } = post;

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://remix.run/dashboard/docs">Check out the docs</a> to get
        started.
      </p>
      <Post code={code} frontmatter={frontmatter} />
    </div>
  );
}
