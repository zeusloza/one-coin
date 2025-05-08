import { useRef } from "react";

function Field(props, ref) {
  const localRef = useRef();
  const inputRef = ref || localRef;
  const { label, id, className, ...rest } = props;
  return (
    <div className="relative w-full has-disabled:opacity-60">
      <input
        ref={inputRef}
        id={id}
        {...rest}
        className={`peer appearance-none w-full flex flex-col bg-purple-700 rounded-2xl
            outline-2 outline-transparent pt-7 px-4 pb-1.5 transition-colors leading-[1em] h-[54px]
            ${rest.type === "date" ? "text-transparent focus:text-white" : ""}
            ${
              rest.value
                ? " focus:invalid:outline-red-500 focus:valid:outline-green-500 text-white"
                : ""
            }
            ${
              rest.type === "file"
                ? `cursor-pointer text-transparent`
                : "cursor-text"
            }
            disabled:opacity-60
            `}
      />
      {inputRef.current?.files?.length > 0 && (
        <span className="absolute bottom-1.5 left-4">
          {inputRef.current.files[0].name}
        </span>
      )}
      <label
        className={`pointer-events-none absolute left-4 text-purple-300 uppercase transition-all 
        ${
          rest.value || inputRef.current?.files?.length
            ? "top-1"
            : "top-1/2 -translate-y-1/2"
        }
       
        peer-focus:[&]:top-1 
        peer-focus:[&]:translate-y-0
        `}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}

export default Field;
