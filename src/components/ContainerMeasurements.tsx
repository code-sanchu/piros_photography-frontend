import { type ReactElement } from "react";
import { useMeasure, type Measures } from "@react-hookz/web";

const ContainerMeasurements = ({
  children,
}: {
  children: (
    arg0: Measures,
  ) => ReactElement | ReactElement[] | (ReactElement | null)[] | null;
}) => {
  const [measurements, ref] = useMeasure<HTMLDivElement>();

  return <div ref={ref}>{measurements ? children(measurements) : null}</div>;
};

export default ContainerMeasurements;
