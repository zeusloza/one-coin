import { Color, Vector3 } from "three";

export const ToonShader = {
  uniforms: {
    color: { value: new Color("rgb(128,128,128)") },
    brightnessThresholds: {
      value: [0.9, 0.45, 0.002],
    },
    lightPosition: { value: new Vector3(15, 15, 15) },
    gradientStrength: { value: 0.5 }, // 0 = sin degradado, 1 = degradado puro
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormalView;
    varying vec3 vLightDirView;

    uniform vec3 lightPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormalView = normalize(normalMatrix * normal);
      vec3 lightPosView = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
      vLightDirView = normalize(lightPosView - mvPosition.xyz);

      gl_Position = projectionMatrix * mvPosition;
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform vec3 color;
    uniform float brightnessThresholds[3];
    uniform float gradientStrength;

    varying vec3 vNormalView;
    varying vec3 vLightDirView;

    void main() {
      // 1) cálculo de brillo (0 a 1)
      float brightness = max(dot(normalize(vNormalView), normalize(vLightDirView)), 0.0);

      // 2) degradado suave general (ambient ↔ full light)
      //    ambient mínimo al 20%, máximo al 120% para un poco extra de brillo
      vec3 soft = mix(color * 0.5, color * 1.5, brightness);

      // 3) cel-shading duro por umbrales
      vec3 hard;
      if (brightness > brightnessThresholds[0]) {
        hard = color * 1.5;
      } else if (abs(brightness - brightnessThresholds[1]) < 0.03) {
        hard = color;
      } else if (brightness > brightnessThresholds[1]) {
        hard = color * 1.1;
      } else if (brightness > brightnessThresholds[2]) {
        hard = color * 0.6;
      } else {
        hard = color * 0.6;
      }

      // 4) mezcla final: mezcla el hard-shade con el degradado suave
      vec3 finalColor = mix(soft, hard, gradientStrength);

      gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
    }`,
};
