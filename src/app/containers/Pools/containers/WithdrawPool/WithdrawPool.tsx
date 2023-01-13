// import React, { useMemo, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import {selectCurrentPool, selectPredirect} from "@app/containers/Pools/store/selectors";
// import * as mainActions from "@app/containers/Pools/store/actions";
// import {Button, Input, Title} from "@app/shared/components";
// import {onWithdraw} from "@app/containers/Pools/store/actions";
// import {fromGroths} from "@core/appUtils";
//
// export const WithdrawPool = () => {
//     const data = useSelector(selectCurrentPool());
//     const predictData = useSelector(selectPredirect());
//     const [requestData, setRequestData] = useState(null)
//
//     const dispatch = useDispatch()
//
//     useMemo(() => {
//             dispatch(mainActions.onWithdraw.request(data));
//     }, [requestData]);
//     return (
//         <div className="create-pool-wrapper">
//             <Title variant="heading">Withdraw</Title>
//             <div className="create-pool-assets-container">
//                 <Title variant="subtitle">Select token</Title>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">{data.metadata1.N}:</div>
//                 <div className="amount-value">{fromGroths(Number(data.tok1))}</div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">{data.metadata2.N}:</div>
//                 <div className="amount-value">{fromGroths(Number(data.tok2))}</div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">Buy:</div>
//                 <div className="amount-value">
//                     {predictData ? predictData.buy : "0"}
//                 </div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">Fee-dao:</div>
//                 <div className="amount-value">
//                     {predictData ? predictData.fee_dao : "0"}
//                 </div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">Fee-pool:</div>
//                 <div className="amount-value">
//                     {predictData ? predictData.fee_pool : "0"}
//                 </div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">Pay:</div>
//                 <div className="amount-value">
//                     {predictData ? predictData.pay : "0"}
//                 </div>
//             </div>
//             <div className="amount-wrapper">
//                 <div className="amount-title">Pay-raw:</div>
//                 <div className="amount-value">
//                     {predictData ? predictData.pay_raw : "0"}
//                 </div>
//             </div>
//             <div className="button-wrapper">
//                 <Button onClick={() => onWithdraw(requestData)}>Trade</Button>
//             </div>
//         </div>
//     );
// };
