import { useEffect, useState } from 'react';
import { IUseValidation } from '@app/shared/interface';
import { useDispatch } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';

export const useValidation = ({ value, validations }: IUseValidation) => {
  const [isEmpty, setIsEmpty] = useState<Boolean>(true);
  const [isMax, setIsMax] = useState<Boolean>(false);
  const [isValid, setIsValid] = useState<Boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    for (const key in validations) {
      const val = validations[key as keyof typeof validations];
      switch (key) {
        case 'isEmpty':
          dispatch(mainActions.setPredict(null));
          setIsEmpty(!value);
          break;
        case 'isMax':
          console.log(value)
          if (val) {
            dispatch(mainActions.setPredict(null));
            setIsMax((+value >= val));
          }
          break;
        default:
      }
    }
  }, [value]);

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
