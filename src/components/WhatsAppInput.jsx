import React from "react";
import Field from "@/components/Field";

// Regex: +52 opcional, espacio/guión opcional, lada 2–3 dígitos (con o sin paréntesis),
// espacio/guión opcional, 3–4 dígitos, espacio/guión opcional, 4 dígitos.
const phoneRegex =
  /^(?:\+52)?[ -]?(?:\(\d{2,3}\)|\d{2,3})[ -]?\d{3,4}[ -]?\d{4}$/;

export default function WhatsAppInput({ value, onChange, className }) {
  const inputChange = (e) => {
    const input = e.target;

    onChange(e);

    if (!phoneRegex.test(input.value)) {
      e.target.setCustomValidity(
        "Inválido: usa lada (2–3 dígitos) + número (7–8 dígitos), ej. +52 (55) 1234-5678"
      );
      return;
    }
    e.target.setCustomValidity("");
  };

  return (
    <Field
      type="text"
      inputMode="tel"
      id="whatsapp"
      name="whatsapp"
      required
      autoComplete="off"
      value={value}
      onChange={inputChange}
      className={className}
      label="Número de WhatsApp"
    />
  );
}
