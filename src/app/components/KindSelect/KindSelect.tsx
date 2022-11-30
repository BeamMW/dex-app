import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Select } from "theme-ui";
import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { Kind } from "@app/library/dex/types";
import { useGetPoolKindDesc } from "../PoolKindDesc";

const KindSelect: React.FC<{
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}> = observer(({
    onChange,
}) => {

    return (
        <Select
            onChange={onChange}
            sx={{ width: "10rem", mt:"0.5rem" }}
            arrow={
            <Box
                as="svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentcolor"
                sx={{
                ml: -28,
                alignSelf: "center",
                pointerEvents: "none",
                marginTop:"0.5rem"
                }}
            >
                <path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" />
            </Box>
            }
            defaultValue={Kind.Low}
        >
            {Object.values(Kind)
            .filter((v) => !isNaN(Number(v)))
            .map((value) => (
                <option key={value} value={value}>
                {useGetPoolKindDesc({ kind: +value })}
                </option>
            ))}
        </Select>
    )

});

export default KindSelect;