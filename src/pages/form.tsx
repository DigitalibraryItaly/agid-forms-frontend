import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import { FormConfig } from "../generated/graphql/FormConfig";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import FormTemplate from "./forms/form-template";

const RouterPage = ({
  pageComponent,
  ...routerProps
}: {
  pageComponent: (routerProps: RouteComponentProps) => JSX.Element;
} & RouteComponentProps) => {
  return pageComponent(routerProps);
};

const Form = ({ data }: { data: FormConfig }) => (
  <Router>
    <RouterPage
      pageComponent={(props: RouteComponentProps<{ formId: string }>) => (
        <FormTemplate data={data} formId={props.formId} />
      )}
      path="/form/:formId"
    />
  </Router>
);

export const query = graphql`
  query FormConfig {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
      ...PageConfigFragment
    }
    allFormYaml {
      edges {
        node {
          id
          form_fields {
            default
            description
            name
            title
            type
          }
        }
      }
    }
  }
`;

export default Form;
