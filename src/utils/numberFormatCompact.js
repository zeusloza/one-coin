/**
 * Formatea un número usando notación compacta (K, M, B, T).
 * Similar al estilo de YouTube.
 *
 * @param {number} number El número a formatear.
 * @param {string} [lang='en-US'] El código de idioma para el formato (p.ej., 'es-ES', 'en-US').
 * @param {number} [maxDigits=1] Máximo de dígitos fraccionales a mostrar (p.ej., 1.5K).
 * @returns {string} El número formateado como string.
 */
export const numberFormatCompact = (number, lang = "en-US", maxDigits = 1) => {
  // Validar si es un número válido
  if (typeof number !== "number" || isNaN(number)) {
    // Devolver el valor original o un string vacío/error si no es un número
    return String(number);
  }

  // Para números pequeños (menores a 1000), la notación compacta
  // usualmente los deja como están, pero podemos asegurarnos
  // devolviendo el formato estándar si prefieres comas (ej: 999).
  // Sin embargo, 'compact' debería manejarlo bien.
  // if (Math.abs(number) < 1000) {
  //   return new Intl.NumberFormat(lang).format(number);
  // }

  try {
    const formatter = new Intl.NumberFormat(lang, {
      notation: "compact", // Activa la abreviación (K, M, etc.)
      compactDisplay: "short", // Usa la forma corta ('K') en vez de larga ('thousand')
      maximumFractionDigits: maxDigits, // Controla los decimales (1.5K vs 1K)
      minimumFractionDigits: 0, // No fuerza decimales si es un número entero (1K vs 1.0K)
    });
    return formatter.format(number);
  } catch (error) {
    console.error("Error formateando número:", error);
    // Fallback a formato simple si 'compact' falla (ej. navegador muy viejo)
    return new Intl.NumberFormat(lang).format(number);
  }
};
