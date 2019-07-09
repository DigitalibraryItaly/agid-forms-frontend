import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import PrivateRoute from "../components/PrivateRoute";
import { ViewConfig } from "../generated/graphql/ViewConfig";
import RevisionTemplate from "./forms/revision-template";

const View = ({ data }: { data: ViewConfig }) => (
  <Router>
    <PrivateRoute
      component={(
        props: RouteComponentProps<{ uuid: string; version: number }>
      ) => (
        <RevisionTemplate
          data={data}
          uuid={props.uuid!}
          version={props.version!}
        />
      )}
      path="/revision/:uuid/:version"
    />
  </Router>
);

export const query = graphql`
  query RevisionConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
    allFormYaml {
      ...FormSchemaFragment
    }
  }
`;

export default View;