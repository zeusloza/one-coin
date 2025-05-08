import Select from "@/components/Select";
import dataCountries from "@/data/countries.json";

export default function LocationFields({ value, onChange }) {
  function countryCodeToFlagEmoji(code) {
    return code
      .toUpperCase()
      .split("")
      .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      .join("");
  }

  return (
    <Select
      id="country"
      name="country"
      value={value || ""}
      onChange={onChange}
      required
      label="País de residencia"
    >
      <option value="" disabled>
        Seleccione un país
      </option>
      {dataCountries.map((c) => (
        <option key={c.code} value={c.name}>
          {countryCodeToFlagEmoji(c.code)} {c.name}
        </option>
      ))}
    </Select>
  );
}
