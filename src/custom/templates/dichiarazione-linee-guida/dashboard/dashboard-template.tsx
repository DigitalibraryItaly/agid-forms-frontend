import * as React from "react";

import SEO from "../../../../components/Seo";

import { Link } from "@reach/router";
import { graphql, Link as GatsbyLink, useStaticQuery } from "gatsby";

import { format } from "date-fns";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import StaticLayout from "../../../../components/StaticLayout";
import { getSessionInfo } from "../../../../utils/auth";

import {
  GetUserNodesOfType,
  GetUserNodesOfTypeVariables
} from "../../../../generated/graphql/GetUserNodesOfType";

import { getContextualMenu } from "../../../../graphql/gatsby";
import { GET_USER_NODE_OF_TYPE } from "../../../../graphql/hasura";

const DashboardDeclTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewDeclCta = () => (
    <p>
      <GatsbyLink
        to="/form/dichiarazione-linee-guida"
        className="btn btn-outline-primary"
      >
        {t("lg_decl.create_new_decl_cta")}{" "}
        <span
          aria-hidden="true"
          style={{
            fontSize: "24px",
            lineHeight: "1px",
            paddingLeft: "16px",
            fontWeight: "bold"
          }}
        >
          +
        </span>
      </GatsbyLink>
    </p>
  );

  const data = useStaticQuery(graphql`
    query DashboardDeclConfig {
      allMenuYaml {
        ...ContextualMenuFragment
      }
    }
  `);

  return (
    <StaticLayout
      title={t("lg_decl.dashboard_title")}
      contextMenu={getContextualMenu(data, "dichiarazione-linee-guida")}
      breadcrumbItems={[
        { label: t("lg_decl.title"), link: "/doc/dichiarazione-linee-guida" },
        { label: t("lg_decl.dashboard_title"), link: "" }
      ]}
    >
      <SEO title={t("lg_decl.dashboard_title")} />
      <Query<GetUserNodesOfType, GetUserNodesOfTypeVariables>
        query={GET_USER_NODE_OF_TYPE}
        fetchPolicy="network-only"
        variables={{
          userId: sessionInfo.userId,
          nodeType: "dichiarazione_linee_guida"
        }}
      >
        {({
          loading: userNodesLoading,
          error: userNodesError,
          data: userNodes
        }) => {
          if (userNodesLoading) {
            return <p>{t("loading_data")}</p>;
          }
          if (userNodesError) {
            return (
              <p>
                {t("errors.error_getting_data")}{" "}
                {JSON.stringify(userNodesError)}
              </p>
            );
          }
          if (userNodes && !userNodes.node[0]) {
            return (
              <div className="p-lg-4">
                <h2>{t("lg_decl.create_new_decl_title")}</h2>
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("lg_decl.create_new_decl_desc")
                  }}
                />
                <NewDeclCta />
              </div>
            );
          }
          return (
            <div>
              <NewDeclCta />
              <div className="table-responsive">
                <table className="table table-hover mt-4">
                  <thead className="lightgrey-bg-a3">
                    <tr>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("name")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("lg_decl.dashboard_sent_date")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("lg_decl.dashboard_adjustment_date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-size-xs color-black font-weight-600">
                    {userNodes &&
                      userNodes.node.map(node => {
                        return (
                          <tr key={node.id}>
                            <td className="px-5">
                              {node.content.values["website-name"]}
                              <br />
                              <small className="font-size-xxs">
                                {node.content.values["website-url"]}
                              </small>
                            </td>
                            <td className="px-5">
                              {format(node.updated_at, "DD/MM/YYYY")}
                            </td>
                            <td className="px-5">
                              {format(
                                node.content.values["adjustment-date"],
                                "DD/MM/YYYY"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }}
      </Query>
    </StaticLayout>
  );
};

export default DashboardDeclTemplate;
