import { IMethod } from "../base/api/Interfaces";
import { ShaderActions } from "./types";


const methods: Array<IMethod<ShaderActions>> = [
    {
        action: "view_deployed",
        type: "readable"
    },
    {
        action: "pools_view",
        type: "readable"
    },
    {
        action: "pool_view",
        requiredParams: ["aid1", "aid2"],
        type: "readable"
    },
    {
        action: "view_all_assets",
        type: "readable"
    },
    {
        action: "pool_create",
        requiredParams: ["aid1", "aid2", "kind"],
        type: "writable"
    },
    {
        action: "pool_destroy",
        requiredParams: ["aid1", "aid2"],
        type: "writable",
        couldPredict: true,
    },
    {
        action: "pool_add_liquidity",
        //remove "tok", "col" because of new trove_modify params bAutoTok, tcr_mperc
        requiredParams: ["aid1", "aid2", "val1", "val2"],
        type: "writable",
        couldPredict: true,
    },
    {
        action: "pool_withdraw",
        requiredParams: ["aid1", "aid2", "ctl"],
        type: "writable",
        couldPredict: true,
    },
    {
        action: "pool_trade",
        requiredParams: ["val1_buy"],
        allowedParams: ["aid1", "aid2", "val1_buy"],
        type: "writable",
        couldPredict: true,
    },
]


export default methods;