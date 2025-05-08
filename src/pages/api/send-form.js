import { SCRIPT_URL } from "astro:env/server";

export async function POST({ request }) {
  try {
    // 1. Recibir los datos
    const formData = await request.formData();

    // 2. Convertir FormData a algo que puedas mandar a Apps Script
    //    (se manda tal cual para que Google Apps Script reciba e.parameter)
    const body = new FormData();
    for (const [key, value] of formData.entries()) {
      body.append(key, value);
    }

    // 3. Enviar a tu Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error(`Error en Google Apps Script: ${response.statusText}`);
    }

    // 4. Retornar la respuesta de Google Apps Script
    const result = await response.text();
    return new Response(result, { status: 200 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return new Response(`Error interno: ${error.message}`, { status: 500 });
  }
}
