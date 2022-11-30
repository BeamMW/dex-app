import React from "react";
import { Flex, Card, Box } from "theme-ui";
import { InfoIcon } from "../InfoIcon/InfoIcon";

type StatisticProps = {
  children: React.ReactNode;
  name: React.ReactNode;
  tooltip?: React.ReactNode;
  maxSize?: string;
};

export const Statistic: React.FC<StatisticProps> = ({ name, tooltip, maxSize, children }) => {
  return (
    <Flex sx={{ py: "6px", maxWidth:(maxWidth) => `${maxSize}`, alignItems: 'center' }}>
      <Flex sx={{ alignItems: "center", fontWeight: 200, marginRight: '20px', justifyContent: 'flex-start' }}>
        <Flex sx={{ fontFamily:'ProximaNova', fontSize: "14px", fontWeight:400, color:'rgba(255,255,255,0.5)', whiteSpace:'nowrap' }}>{name}</Flex>
        {tooltip && <Box sx={{alignSelf:'flex-end'}}><InfoIcon size="xs" tooltip={<Card variant="tooltip">{tooltip}</Card>}/> </Box>}
      </Flex>
      <Flex sx={{ justifyContent: "flex-start",flex: 4, alignItems: "center", whiteSpace: 'nowrap'}}>{children}</Flex>
    </Flex>
  );
};
