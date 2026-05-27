import type { StudioPiece } from "../types";

/** Large left tile in the studio band */
export const studioFeaturedId = "temple-cityscape";

/**
 * Full originals: public/assets/life/paintings/
 * Tile thumbnails: public/assets/life/paintings/thumbs/ (npm run life:thumbs)
 */
export const studioPieces: StudioPiece[] = [
  {
    id: "temple-cityscape",
    title: "Temple cityscape at night",
    medium: "Oil · Featured",
    layout: "large",
    thumb: "/assets/life/paintings/thumbs/temple.jpeg",
    full: "/assets/life/paintings/temple.jpeg",
    placeholderIcon: "🏛",
    placeholderLabel: "Temple cityscape at night\nOil on canvas",
  },
  {
    id: "woman-in-red",
    title: "Woman in red",
    medium: "Oil · Portraiture",
    layout: "wide",
    thumb: "/assets/life/paintings/thumbs/women in red.jpeg",
    full: "/assets/life/paintings/women in red.jpeg",
    placeholderIcon: "🎨",
    placeholderLabel: "Woman in red\nOil · Photorealist",
  },
  {
    id: "laughing-sketch",
    title: "Laughing sketch",
    medium: "Pencil",
    layout: "default",
    thumb: "/assets/life/paintings/thumbs/laughing.jpeg",
    full: "/assets/life/paintings/laughing.jpeg",
    placeholderIcon: "✏️",
    placeholderLabel: "Laughing sketch\nPencil",
  },
  {
    id: "rembrandt-study",
    title: "Self-portrait study",
    medium: "Oil · Study after Rembrandt",
    layout: "wide",
    thumb: "/assets/life/paintings/thumbs/rembrandt.jpeg",
    full: "/assets/life/paintings/rembrandt.jpeg",
    placeholderIcon: "🖌",
    placeholderLabel: "After Rembrandt\nOil · Study",
  },
  {
    id: "green-hooded",
    title: "Green hooded portrait",
    medium: "Pastel",
    layout: "default",
    thumb: "/assets/life/paintings/thumbs/green hooded.jpeg",
    full: "/assets/life/paintings/green hooded.jpeg",
    placeholderIcon: "🎭",
    placeholderLabel: "Green hooded\nPastel",
  },
  {
    id: "madonna-child",
    title: "Madonna and child",
    medium: "Oil · Figurative",
    layout: "default",
    thumb: "/assets/life/paintings/thumbs/madonna.jpeg",
    full: "/assets/life/paintings/madonna.jpeg",
    placeholderIcon: "🖼",
    placeholderLabel: "Madonna & child\nOil",
  },
  {
    id: "mother-and-child",
    title: "Mother and child",
    medium: "Oil · Figurative",
    layout: "default",
    thumb: "/assets/life/paintings/thumbs/mother and child.jpeg",
    full: "/assets/life/paintings/mother and child.jpeg",
    placeholderIcon: "🖼",
    placeholderLabel: "Mother and child\nOil",
  },
];
