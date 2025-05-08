import { SCRIPT_URL } from "astro:env/server";

export async function POST({ request }) {
  try {
    // 1. Tomás el FormData entrante
    const formData = await request.formData();

    // 2. (Opcional) Asegurate de que venga el flag de validación
    if (!formData.has("validate")) {
      formData.set("validate", "true");
    }

    // 3. Lo mandás a tu Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`GAS error: ${response.status} ${response.statusText}`);
    }

    // 4. Parseás JSON, no texto
    const result = await response.json();

    // 5. Devolvés el mismo JSON al frontend
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en endpoint de validación:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
