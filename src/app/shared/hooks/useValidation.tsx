import { useEffect, useState } from 'react';
import { IUseValidation } from '@app/shared/interface';

export const useValidation = ({ value, validations }: IUseValidation) => {
  const [isEmpty, setIsEmpty] = useState<Boolean>(true);
  const [isMax, setIsMax] = useState<Boolean>(false);
  const [isValid, setIsValid] = useState<Boolean>(false);

  useEffect(() => {
    Object.keys(validations).forEach((key) => {
      const val = validations[key as keyof typeof validations];
      switch (key) {
        case 'isEmpty':
          setIsEmpty(!value);
          break;
        case 'isMax':
          if (val) {
            setIsMax(+String(value).replace(/,/g, '') >= val);
          }
          break;
        default:
      }
    });
  }, [value, validations]);

  useEffect(() => {
    if (isEmpty || isMax) {
      setIsValid(false);
    } else setIsValid(true);
  }, [isEmpty, isMax]);

  return {
    isEmpty,
    isValid,
    isMax,
  };
};
