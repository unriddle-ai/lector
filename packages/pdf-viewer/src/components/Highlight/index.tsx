import { HighlightRect, usePDF } from "@/lib/internal";
import { usePDFPageNumber } from "@/lib/pdf/page";
import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

interface HighlightLayerProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const convertToPercentString = (rect: Omit<HighlightRect, "pageNumber">) => {
  return {
    top: `${rect.top}%`,
    left: `${rect.left}%`,
    height: `${rect.height}%`,
    width: `${rect.width}%`,
  };
};

type Dimensions = {
  top: string | number;
  left: string | number;
  height: string | number;
  width: string | number;
};
export const HighlightLayer = forwardRef<
  ElementRef<"div">,
  HighlightLayerProps
>(({ asChild, className, style, ...props }, ref) => {
  const pageNumber = usePDFPageNumber();
  const highlights = usePDF((state) => state.highlights);

  const Comp = asChild ? Slot : "div";

  const rects = highlights.filter((area) => area.pageNumber === pageNumber);

  if (!rects?.length) return null;

  return (
    <>
      {rects.map((rect, index) => {
        const { pageNumber, type, ...coordinates } = rect;

        let dimensions: Dimensions = coordinates;
        if (type === "percent") {
          dimensions = convertToPercentString(rect);
        }

        return (
          <Comp
            ref={ref}
            key={`highlight-${pageNumber}-${index}`}
            className={className}
            style={{
              position: "absolute",
              ...dimensions,
              pointerEvents: "none",
              zIndex: 30,
              ...style,
            }}
            {...props}
          >
            {props.children}
          </Comp>
        );
      })}
    </>
  );
});

HighlightLayer.displayName = "HighlightLayer";