import { useCallback } from "react";
import { usePDFPageNumber } from "../../hooks/usePdfPageNumber";
import { useSelectionDimensions } from "../../hooks/useSelectionDimensions";
import { usePdf, type ColoredHighlight } from "../../internal";
import { SelectionTooltip } from "../selection-tooltip";
import { v4 as uuidv4 } from "uuid";

type ColoredHighlightLayerProps = {
  highlighterColors?: colorItem[];
  onHighlight?: (highlight: ColoredHighlight) => void;
};

type colorItem = {
  color: string;
  localization: {
    id: string;
    defaultMessage: string;
  };
};

const defaultColors: colorItem[] = [
  {
    color: "#e3b127",
    localization: {
      id: "yellow",
      defaultMessage: "Yellow",
    },
  },
  {
    color: "#419931",
    localization: {
      id: "green",
      defaultMessage: "Green",
    },
  },
  {
    color: "#4286c9",
    localization: {
      id: "blue",
      defaultMessage: "Blue",
    },
  },
  {
    color: "#f246b6",
    localization: {
      id: "pink",
      defaultMessage: "Pink",
    },
  },
  {
    color: "#a53dd1",
    localization: {
      id: "purple",
      defaultMessage: "Purple",
    },
  },
  {
    color: "#f09037",
    localization: {
      id: "orange",
      defaultMessage: "Orange",
    },
  },
  {
    color: "#37f0d4",
    localization: {
      id: "teal",
      defaultMessage: "Teal",
    },
  },
  {
    color: "#3d0ff5",
    localization: {
      id: "purple",
      defaultMessage: "Purple",
    },
  },
  {
    color: "#f50f26",
    localization: {
      id: "red",
      defaultMessage: "Red",
    },
  },
];

export const ColoredHighlightLayer = ({
  highlighterColors = defaultColors,
  onHighlight,
}: ColoredHighlightLayerProps) => {
  const pageNumber = usePDFPageNumber();
  const { getSelection } = useSelectionDimensions();

  const highlights: ColoredHighlight[] = usePdf(
    (state) => state.coloredHighlights,
  );
  const addColoredHighlight = usePdf((state) => state.addColoredHighlight);
  const deleteColoredHighlight = usePdf(
    (state) => state.deleteColoredHighlight,
  );

  const handleHighlighting = useCallback((color: string) => {
    const { highlights, text } = getSelection();

    if (highlights[0]) {
      const highlight: ColoredHighlight = {
        uuid: uuidv4(),
        pageNumber: highlights[0].pageNumber, // usePDFPageNumber() doesn't return the correct page number, so i'm getting the number directly from the first highlight
        color,
        highlights,
        text,
      };
      addColoredHighlight(highlight);
      if (onHighlight) onHighlight(highlight);
    }
  }, []);

  return (
    <>
      {highlights
        .filter((selection) => selection.pageNumber === pageNumber)
        .map((selection) =>
          selection.highlights.map((rect, index) => (
            <span
              key={`${selection.uuid}-${index}`}
              onClick={() => deleteColoredHighlight(selection.uuid)}
              style={{
                position: "absolute",
                top: rect.top,
                left: rect.left,
                height: rect.height,
                width: rect.width,
                cursor: "pointer",
                zIndex: 30,
                backgroundColor: selection.color,
                // mixBlendMode: "lighten", // changes the color of the text
                mixBlendMode: "darken", // best results
                // mixBlendMode: "multiply", // works but coloring has some inconsistencies
              }}
            />
          )),
        )}

      <SelectionTooltip>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#363636",
            borderRadius: "0.5rem",
          }}
        >
          {highlighterColors.map(({ color, localization }, index) => (
            <button
              key={index}
              onClick={() => handleHighlighting(color)}
              title={localization.defaultMessage}
              aria-label={localization.defaultMessage}
              style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </SelectionTooltip>
    </>
  );
};
