// import { useEffect, useState } from 'react';
// import { IUseValidation } from '@core/types';
//
// export const useValidation = ({ value, validations }: IUseValidation) => {
//   const [isEmpty, setIsEmpty] = useState<Boolean>(true);
//   const [emailErr, setEmailErr] = useState<Boolean>(false);
//   const [minLengthErr, setMinLengthErr] = useState<Boolean>(false);
//   const [isValid, setIsValid] = useState<Boolean>(false);
//
//   useEffect(() => {
//     for (const key in validations) {
//       const val = validations[key as keyof typeof validations];
//       switch (key) {
//         case 'isEmpty':
//           setIsEmpty(!value);
//           break;
//         case 'minLength':
//           if (val) setMinLengthErr((value as string).length < val);
//           break;
//         case 'isEmail':
//           setEmailErr(!EMAIL_REGEX.test(String(value).toLowerCase()));
//           break;
//         default:
//       }
//     }
//   }, [value]);
//
//   useEffect(() => {
//     if (isEmpty || minLengthErr || emailErr) {
//       setIsValid(false);
//     } else setIsValid(true);
//   }, [isEmpty, minLengthErr, emailErr]);
//
//   return {
//     isEmpty,
//     emailErr,
//     minLengthErr,
//     isValid,
//   };
// };
