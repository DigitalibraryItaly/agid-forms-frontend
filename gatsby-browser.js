/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react";
import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/graphql/client";

// import { ThemeProvider } from "styled-components";
// import theme from "./theme";

export const wrapRootElement = ({ element }) => (
  // <ThemeProvider theme={theme}>
  <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  // </ThemeProvider>
);
