import { useState } from 'react';
import { useValidation } from './useValidation';

export function useInput({
  initialValue,
  validations,
}) {
  const [value, setValue] = useState<number>(initialValue);
  const [isDirty, setDirty] = useState<boolean>(false);

  const valid = useValidation({ value, validations });

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setDirty(true);
  };

  const onPredict = (e) => {
    setValue(e);
  };

  return {
    value,
    onChange,
    onPredict,
    isDirty,
    ...valid,
  };
}
