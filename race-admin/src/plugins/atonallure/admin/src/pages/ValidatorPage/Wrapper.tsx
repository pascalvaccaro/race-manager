import React from "react";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { HeaderLayout, ContentLayout } from "@strapi/design-system/Layout";
import { Link } from "@strapi/design-system/Link";
import ArrowLeft from "@strapi/icons/ArrowLeft";

const Wrapper = ({ children, title, subtitle = "" }) => (
  <Box background="neutral100">
    <HeaderLayout
      navigationAction={
        <Link startIcon={<ArrowLeft />} to="/plugins/atonallure">
          Retour
        </Link>
      }
      title={title}
      subtitle={subtitle}
      as="h2"
    />
    <ContentLayout>
      <Flex
        padding={4}
        justifyContent="center"
        style={{ width: "100%", height: "100vh" }}
      >
        {children}
      </Flex>
    </ContentLayout>
  </Box>
);

export default Wrapper;
