import { useState } from "react";
import WhatsAppInput from "@/components/WhatsAppInput";
import DateOfBirthInput from "@/components/DateOfBirthInput";
import CountryField from "@/components/CountryField";
import Field from "@/components/Field";
import Select from "@/components/Select";
import RainbowButton from "@/components/RainbowButton";
import RainbowText from "@/components/RainbowText";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    bodyType: "",
    email: "",
    whatsapp: "",
    instagram: "",
    country: "",
    city: "",
    photo: null,
    personality: "",
    willingToTravel: "",
    preferredCities: "",
    participationDescription: "",
    privacyPolicy: false,
  });

  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    e.target.setCustomValidity("");
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateRemote = async (data) => {
    console.log("Validando con:", data);
    if (!data.email && !data.whatsapp && !data.instagram) return true;
    let hasError = false;

    for (const field of ["email", "whatsapp", "instagram"]) {
      const input = document.getElementById(field);
      if (!input) continue;

      // limpia antes
      input.setCustomValidity("");

      if (!data[field]) continue;

      const fd = new FormData();
      fd.append("validate", "true");
      fd.append("validateField", field);
      fd.append(field, data[field]);

      try {
        const res = await fetch("/api/validate", { method: "POST", body: fd });
        const json = await res.json();

        if (json.exists) {
          input.setCustomValidity(
            field === "email"
              ? "Este correo ya está registrado."
              : field === "whatsapp"
              ? "Este número ya está registrado."
              : "Este usuario ya está registrado."
          );
          hasError = true;
        }
      } catch {
        input.setCustomValidity("Error al validar. Intenta de nuevo.");
        hasError = true;
      }
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Valida primero HTML nativo
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    setLoading(true);

    // 2. Valida en remoto y espera el resultado
    const remotoOk = await validateRemote(formData);
    if (!remotoOk) {
      // Si hay errores, reporta para que aparezcan los mensajes
      e.target.reportValidity();
      setLoading(false);
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    if (formData.photo) {
      try {
        const base64Photo = await fileToBase64(formData.photo);
        form.append("photoBase64", base64Photo);
        form.append("photoName", formData.photo.name);
        form.append("photoType", formData.photo.type);
      } catch {
        alert("Error al procesar la imagen. Por favor, intenta nuevamente.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/send-form", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error();
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "femenino",
        height: "",
        bodyType: "",
        email: "",
        whatsapp: "",
        instagram: "",
        country: "Mexico",
        city: "",
        photo: null,
        personality: "",
        willingToTravel: "",
        preferredCities: "",
        participationDescription: "",
      });
      setFormSubmitted(true);
    } catch {
      alert("Hubo un problema al enviar. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setFormSubmitted(false);
  };

  return (
    <section id="registration-form" className="z-10">
      <h2 className="hidden">Casting</h2>
      <div className="w-fit mx-auto animate-fade-up">
        <RainbowText>Casting</RainbowText>
      </div>
      <form
        className="max-w-2xl mx-auto flex flex-col gap-2 p-4 animate-fade-up"
        onSubmit={handleSubmit}
      >
        <fieldset className="flex flex-col gap-2" id="contact-information">
          <legend className="hidden">Información de Contacto</legend>

          <Field
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
            label="Correo electrónico"
          />

          <WhatsAppInput value={formData.whatsapp} onChange={handleChange} />

          <Field
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            required
            autoComplete="off"
            pattern="^[a-z0-9._]{1,30}$"
            label="Instagram (perfil público)"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="hidden">Datos Personales</legend>

          <Field
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            autoComplete="off"
            pattern="^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$"
            label="Nombre completo"
          />

          <div className="w-full flex gap-2 max-md:flex-wrap">
            <DateOfBirthInput
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              label="Género"
            >
              <option value="" disabled>
                Género
              </option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </Select>
          </div>

          <div className="flex gap-2 max-md:flex-wrap">
            <Field
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              step="0.01"
              required
              autoComplete="off"
              min="0"
              max="3.0"
              label="Estatura (en metros)"
            />

            <Select
              id="bodyType"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
              required
              label="Complexión física"
            >
              <option value="" disabled>
                Complexión física
              </option>
              {formData.gender === "femenino" ? (
                <>
                  <option value="delgada">Delgada</option>
                  <option value="promedio">Promedio</option>
                  <option value="atletica">Atlética</option>
                  <option value="robusta">Robusta</option>
                  <option value="corpulenta">Corpulenta</option>
                  <option value="delgada_atletica">Delgada Atlética</option>
                  <option value="musculosa">Musculosa</option>
                </>
              ) : (
                <>
                  <option value="delgado">Delgado</option>
                  <option value="promedio">Promedio</option>
                  <option value="atletico">Atlético</option>
                  <option value="robusto">Robusto</option>
                  <option value="corpulento">Corpulento</option>
                  <option value="delgado_atletico">Delgado Atlético</option>
                  <option value="musculoso">Musculoso</option>
                </>
              )}
            </Select>
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="hidden">Ubicación</legend>
          <div className="flex gap-2 max-md:flex-wrap">
            <CountryField value={formData.country} onChange={handleChange} />
            <Field
              id="city"
              name="city"
              type="text"
              value={formData.city || ""}
              onChange={handleChange}
              required
              autoComplete="off"
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s\-]+$"
              title="Sólo letras, espacios y guiones"
              label="Ciudad de residencia"
            />
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="hidden">Información Adicional</legend>
          <div className="flex gap-2 max-md:flex-wrap">
            <Field
              type="file"
              id="photoInput"
              name="photo"
              onChange={handleChange}
              accept="image/*"
              required
              label="Seleccionar foto"
            />

            <Select
              id="personality"
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              required
              label="Personalidad"
            >
              <option value="" disabled>
                Personalidad
              </option>
              {formData.gender === "femenino" ? (
                <>
                  <option value="extrovertida">Extrovertida</option>
                  <option value="introvertida">Introvertida</option>
                  <option value="ambivertida">Ambivertida</option>
                  <option value="analitica">Analítica</option>
                  <option value="creativa">Creativa</option>
                  <option value="lider">Líder</option>
                  <option value="colaborativa">Colaborativa</option>
                  <option value="detallista">Detallista</option>
                  <option value="independiente">Independiente</option>
                </>
              ) : (
                <>
                  <option value="extrovertido">Extrovertido</option>
                  <option value="introvertido">Introvertido</option>
                  <option value="ambivertido">Ambivertido</option>
                  <option value="analitico">Analítico</option>
                  <option value="creativo">Creativo</option>
                  <option value="lider">Líder</option>
                  <option value="colaborativo">Colaborativo</option>
                  <option value="detallista">Detallista</option>
                  <option value="independiente">Independiente</option>
                </>
              )}
            </Select>
          </div>
          <div
            className={`cursor-text w-full flex items-center gap-4 bg-purple-700 rounded-2xl
            outline-2 outline-transparent p-4 transition-colors z-10
            `}
          >
            <span className="label">
              ¿Estaría dispuest
              {formData.gender === "femenino" ? "a" : "o"} a viajar?
            </span>

            <label
              className="cursor-pointer bg-purple-500 rounded-2xl flex justify-center items-center size-8 aspect-square has-checked:bg-yellow-400 has-checked:text-black uppercase"
              htmlFor="travel-yes"
            >
              Si
              <input
                className="hidden"
                id="travel-yes"
                type="radio"
                name="willingToTravel"
                value="Si"
                onChange={handleChange}
                checked={formData.willingToTravel === "Si"}
              />
            </label>

            <label
              className="cursor-pointer bg-purple-500 rounded-2xl flex justify-center items-center size-8 aspect-square has-checked:bg-yellow-400 has-checked:text-black uppercase"
              htmlFor="travel-no"
            >
              No
              <input
                className="hidden"
                id="travel-no"
                type="radio"
                name="willingToTravel"
                value="No"
                onChange={handleChange}
                checked={formData.willingToTravel === "No"}
              />
            </label>
          </div>

          <Field
            type="text"
            id="preferredCities"
            name="preferredCities"
            value={formData.preferredCities}
            onChange={handleChange}
            required
            autoComplete="off"
            disabled={formData.willingToTravel === "Si" ? false : true}
            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+(?:,\s*[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+)*$"
            title="Una o más ciudades separadas por comas. Sólo letras, espacios y tildes."
            label="Ciudades de interés para mudarse"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="hidden">Participación</legend>
          <div
            className={`cursor-text w-full flex flex-col bg-purple-700 rounded-2xl
            outline-2 outline-transparent p-4 transition-colors z-10
            `}
          >
            <label
              className="text-purple-300 uppercase"
              htmlFor="participationDescription"
            >
              ¿Por qué desea participar?
            </label>
            <textarea
              className="appearance-none outline-none resize-none h-24 block z-10"
              id="participationDescription"
              name="participationDescription"
              value={formData.participationDescription}
              onChange={handleChange}
              required={false}
              autoComplete="off"
              title="La respuesta debe tener entre 10 y 350 caracteres."
              minLength={10}
              maxLength={350}
            />
          </div>
        </fieldset>
        <label
          className="flex items-center gap-4 cursor-pointer my-4 z-10"
          htmlFor="privacyPolicy"
        >
          <span>
            Acepto el uso de mi imagen según esta{" "}
            <a
              className="text-fuchsia-400 font-bold"
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de privacidad
            </a>
            .
          </span>
          <span className="aspect-square size-6">
            <input
              className="
            appearance-none border-2 border-turquoise-400 relative overflow-hidden
          checked:bg-yellow-300 aspect-square
            p-0.5 size-6 rounded-md cursor-pointer"
              id="privacyPolicy"
              type="checkbox"
              name="privacyPolicy"
              value="Si acepto"
              required
              onChange={handleChange}
            />
          </span>
        </label>
        <RainbowButton type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </RainbowButton>
      </form>
      {formSubmitted && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-300 p-8 rounded-2xl z-20 border-2 border-turquoise-400 text-black shadow-2xl">
          <button
            onClick={handleCloseSuccessMessage}
            className="absolute -top-2 -right-2 z-20 rounded-xl p-2 bg-purple-500 font-bold cursor-pointer"
            aria-label="Cerrar mensaje"
          >
            <svg
              className="size-7 fill-white"
              width="800px"
              height="800px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <polygon points="13.63 3.65 12.35 2.38 8 6.73 3.64 2.38 2.37 3.65 6.72 8.01 2.38 12.35 3.65 13.63 8 9.28 12.35 13.64 13.63 12.36 9.27 8.01 13.63 3.65" />
              </g>
            </svg>
          </button>
          <h2 className="hidden">Formulario Enviado</h2>
          <RainbowText>Formulario Enviado</RainbowText>
          <p>
            Gracias por enviar tu solicitud. Por favor, estate al pendiente de
            tu WhatsApp y correo, ya que cualquier respuesta llegará desde
            casting@onecoin.mx.
          </p>
        </div>
      )}
    </section>
  );
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.split(",")[1]);
      } else {
        reject("Error al convertir el archivo");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default RegistrationForm;
