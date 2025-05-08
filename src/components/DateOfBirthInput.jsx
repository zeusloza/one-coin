import Field from "@/components/Field";

const DateOfBirthInput = ({ value, onChange, required = true, className }) => {
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <Field
      type="date"
      id="dateOfBirth"
      name="dateOfBirth"
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="off"
      min={minDate}
      max={maxDate}
      label="Fecha de nacimiento"
    />
  );
};

export default DateOfBirthInput;
