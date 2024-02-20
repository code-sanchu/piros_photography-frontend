import { useRef } from "react";

export function useIsChange<TValue extends string | number>({
  value,
}: {
  value: TValue;
}) {
  const prevValueRef = useRef(value);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== value;

  const reset = () => {
    prevValueRef.current = value;
  };

  return { isChange, resetIsChange: reset };
}
