import { AlertIcon, ErrorIcon, InfoIcon, SuccessIcon } from "~/components/icon";

const Toast = ({
  text,
  type,
}: {
  text: string;
  type: "error" | "success" | "alert" | "info";
}) => {
  return (
    <div
      className="flex w-full max-w-xs items-center text-gray-500"
      role="alert"
    >
      <div
        className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
          type === "alert"
            ? "bg-my-alert text-my-alert-content"
            : type === "error"
            ? "bg-my-error text-my-error-content"
            : type === "success"
            ? "bg-my-success text-my-success-content"
            : "bg-blue-100 text-blue-500"
        }`}
      >
        {type === "error" ? (
          <ErrorIcon />
        ) : type === "success" ? (
          <SuccessIcon />
        ) : type === "alert" ? (
          <AlertIcon />
        ) : (
          <InfoIcon />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{text}</div>
    </div>
  );
};

export default Toast;
