function Select(props, ref) {
  const { label, id, className, ...rest } = props;
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        id={id}
        {...rest}
        className={`appearance-none cursor-pointer text-transparent peer w-full flex flex-col bg-purple-700 rounded-2xl
              outline-2 outline-transparent pt-7 px-4 pb-1.5 leading-[1em] h-[54px] pr-12 overflow-hidden text-ellipsis whitespace-nowrap
              ${rest.value ? " text-white" : ""}
              `}
      >
        {rest.children}
      </select>
      <label
        className={`pointer-events-none absolute left-4 text-purple-300 uppercase transition-all ${
          rest.value ? "top-1" : "top-1/2 -translate-y-1/2"
        }
          `}
        htmlFor={id}
      >
        {label}
      </label>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 size-6 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}

export default Select;
