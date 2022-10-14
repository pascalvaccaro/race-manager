/*
 *
 * HomePage
 *
 */

import React from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from "@strapi/design-system/Flex";
import { Link } from "@strapi/design-system/Link";
import { EmptyStateLayout } from "@strapi/helper-plugin";

import getTrad from "../../utils/getTrad";

const HomePage: React.FC = () => {
  return (
    <Stack>
      <Link to="/plugins/atonallure/validator">
        <Flex
          padding={4}
          justifyContent="center"
          style={{ width: "100%", height: "100%" }}
        >
          <EmptyStateLayout
            content={{
              id: getTrad("file.actions.validate"),
              defaultMessage: "Valider des documents",
            }}
            icon="media"
            hasRadius
          />
        </Flex>
      </Link>
    </Stack>
  );
};

export default HomePage;
