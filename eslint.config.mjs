import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // react-three-fiber é imperativo por design: `useFrame` existe justamente para
    // mutar objetos three.js (câmera, materiais, refs) a cada frame sem re-render do
    // React. As regras do React Compiler (react-hooks/refs, react-hooks/immutability)
    // não reconhecem esse padrão — são falsos positivos aqui, não um code smell real.
    files: ["src/components/ui/hero3d/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
