import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

// --- 1. Estilos Base (Comuns a Dark e Light) ---
const baseThemeStyles = {
  // Configurações Gerais
  "&": {
    height: "100%",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "20px",
    lineHeight: "1.6",
    color: "var(--text-main)",
    backgroundColor: "var(--bg-surface)"
  },
  ".cm-content": {
    padding: "18px 8px",
    fontFamily: "'Crimson Pro', serif",
    caretColor: "var(--primary)"
  },
  
  // Cursor e Seleção
  "&.cm-focused .cm-cursor": { borderLeftColor: "var(--primary)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground ::selection": {
      backgroundColor: "var(--selection-bg) !important" 
  },
  ".cm-cursor": { borderLeftWidth: "2px" },
  
  // Cursor "Gordo" (Vim mode ou overwrite)
  "&.cm-focused .cm-fat-cursor": {
    backgroundColor: "var(--primary)",
    outline: "none",
    color: "var(--primary-fg)"
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    outline: "1px solid var(--border) !important",
    backgroundColor: "transparent"
  },

  // Linhas e Numeração
  ".cm-line": { padding: "0 8px 0 0" },
  ".cm-activeLineGutter": { backgroundColor: "var(--bg-gutter)" },
  ".cm-linenumber": { 
      minWidth: "0px", 
      textAlign: "right", 
      paddingRight: "8px",
      color: "var(--text-muted)"
  },

  // Gutters (Margens laterais)
  ".cm-gutters": {
    border: "none",
    color: "var(--text-muted)",
    backgroundColor: "transparent", // Controlado via CSS var se precisar mudar
    padding: "0 8px"
  },
  ".cm-gutterElement": {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minWidth: "14px"
  },
  
  // Folding (Dobrar código)
  ".cm-foldGutter": {
    width: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--primary)"
  },

  // Ícones de Folding (Customizados)
  ".gutter-fold-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    opacity: "0.6",
    transition: "transform 0.2s ease, opacity 0.2s, color 0.2s",
    color: "var(--text-muted)"
  },
  ".gutter-fold-icon:hover": {
    opacity: "1",
    color: "var(--primary)",
    transform: "scale(1.1)"
  },
  ".gutter-fold-icon.open": { transform: "rotate(0deg)" },
  ".gutter-fold-icon.closed": { transform: "rotate(-90deg)" },
  ".gutter-fold-icon svg": {
    width: "14px",
    height: "14px",
    display: "block",
    pointerEvents: "none"
  },

  // Placeholders e Elementos de Texto
  ".cm-placeholder": {
    color: "var(--text-muted)",
    fontStyle: "italic",
    opacity: "0.6"
  },
  ".cm-strong": { fontWeight: "700" },
  ".cm-em": { fontStyle: "italic" },
  ".cm-heading": { fontWeight: "700", fontSize: "1.1em" },
  ".cm-link": { color: "var(--primary)", textDecoration: "underline" },
  ".cm-matchingBracket": { backgroundColor: "var(--match-bg)", border: "none" },
  ".cm-comment": { color: "var(--text-muted)", fontStyle: "italic" },

  // --- Autocomplete / Tooltip Styles ---
  ".cm-tooltip.cm-tooltip-autocomplete": {
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    borderRadius: "6px",
    boxShadow: "var(--shadow-lg)",
    padding: "0",
    overflow: "hidden",
    minWidth: "250px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    maxHeight: "250px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid var(--bg-gutter)"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--btn-active-bg)",
    color: "var(--text-main)"
  },
  
  // Ícone Médico (SVG Mask)
  ".cm-completionIcon": {
    width: "16px",
    height: "16px",
    backgroundColor: "var(--primary)",
    "-webkit-mask-image": "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/></svg>')",
    "mask-image": "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/></svg>')",
    "-webkit-mask-repeat": "no-repeat",
    "mask-repeat": "no-repeat",
    "-webkit-mask-position": "center",
    "mask-position": "center",
    opacity: "0.8",
    marginRight: "0"
  },
  ".cm-completionLabel": { fontWeight: "600", color: "var(--primary)" },
  ".cm-completionMatchedText": { textDecoration: "underline", textDecorationColor: "var(--primary)" },
  ".cm-completionDetail": {
    marginLeft: "auto",
    fontSize: "0.85em",
    color: "var(--text-muted)",
    fontStyle: "normal"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail": {
    color: "var(--text-main)",
    opacity: "0.7"
  },

  // Snippets
  ".cm-snippetField": {
    backgroundColor: "transparent",
    color: "var(--primary)",
    border: "1px dashed var(--border)",
    borderRadius: "4px",
    padding: "0 4px",
    margin: "0 2px",
    fontWeight: "500",
    fontSize: "0.95em",
    transition: "all 0.2s ease"
  },
  ".cm-snippetField:hover": {
    borderColor: "var(--primary)",
    cursor: "text"
  }
};

// --- 2. Definição dos Temas (Light / Dark) ---
// Como a lógica pesada está no 'baseThemeStyles' usando variáveis,
// os temas aqui servem apenas para definir a flag 'dark: boolean'.

export const medicalLightTheme = EditorView.theme(baseThemeStyles, { dark: false });
export const medicalDarkTheme = EditorView.theme(baseThemeStyles, { dark: true });

// --- 3. Highlight Styles (Unificado) ---
// Usamos o mesmo objeto para ambos, pois as cores são CSS Variables.

const medicalHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, color: "var(--primary)", fontWeight: "700", fontSize: "1.05em" },
  { tag: tags.strong, color: "var(--text-main)", fontWeight: "700" },
  { tag: tags.emphasis, color: "var(--text-main)", fontStyle: "italic" },
  { tag: tags.link, color: "var(--primary)", textDecoration: "underline" },
  { tag: tags.monospace, color: "var(--text-main)", background: "var(--bg-gutter)", borderRadius: "3px", padding: "0 4px" },
  { tag: tags.list, color: "var(--primary)", fontWeight: "700" },
  { tag: tags.quote, color: "var(--text-muted)", fontStyle: "italic" }
]);

export const HighlightStyles = {
  light: medicalHighlightStyle,
  dark: medicalHighlightStyle // Reutiliza o mesmo
};