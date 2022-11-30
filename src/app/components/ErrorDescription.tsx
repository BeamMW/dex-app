import React from "react";
import { Box, Flex, Text } from "theme-ui";

interface ErrorDescripionProps  {
  fontStyle?:string,
  children: React.ReactNode
}
export const ErrorDescription: React.FC<ErrorDescripionProps> = ({ children, fontStyle }) => (
  <Box
    sx={{
      display: "inline-block",
      borderRadius: '4px',
      mb: "1rem",
      bg: "#f58585c2",
      fontStyle: fontStyle ?? 'normal',
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <Text sx={{ color:'#fff', padding: '4px 10px' }}>{children}</Text>
    </Flex>
  </Box>
);
