import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { UserImage } from "~/containers";

export type OnSubmit = (arg0: {
  value: string;
  resetValue: () => void;
}) => void;

// ! *td: add mutation feedback

const CommentForm = ({
  initialValue = "",
  onSubmit,
  placeholder,
}: {
  initialValue: string | undefined;
  onSubmit: OnSubmit;
  placeholder: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex gap-6">
      <UserImage sideSize={40} />
      <div className="w-full">
        <TextareaAutosize
          className={`w-full resize-none border-b bg-transparent pb-2 text-sm text-gray-900 transition-all duration-100 ease-in-out focus:border-b-gray-500`}
          maxRows={4}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isFocused || value.length ? (
          <div className="mt-2 flex items-center justify-between">
            <button className="rounded-lg my-btn my-btn-neutral" type="button">
              Cancel
            </button>
            <button
              className="rounded-lg bg-blue-600 text-white my-btn hover:bg-blue-800"
              onClick={() =>
                onSubmit({
                  value,
                  resetValue: () => setValue(""),
                })
              }
              type="button"
            >
              Comment
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommentForm;