import { PDFStore, usePDF } from "@/lib/internal";
import { getFitWidthZoom } from "@/lib/zoom";
import React, { useEffect, useLayoutEffect } from "react";

interface UseFitWidth {
  viewportRef: React.RefObject<HTMLDivElement>;
}
export const useFitWidth = ({ viewportRef }: UseFitWidth) => {
  const viewports = usePDF((state) => state.viewports);
  const zoomOptions = usePDF((state) => state.zoomOptions);

  const updateZoom = usePDF((state) => state.updateZoom);
  const store = PDFStore.useContext();

  useLayoutEffect(() => {
    if (viewportRef.current === null) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const isFitWidth = store.getState().isZoomFitWidth;

        if (entry.target === viewportRef.current && isFitWidth) {
          const containerWidth = entry.contentRect.width;
          const newZoom = getFitWidthZoom(
            containerWidth,
            viewports,
            zoomOptions,
          );
          updateZoom(newZoom, true);
        }
      }
    });

    resizeObserver.observe(viewportRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [viewports, zoomOptions]);

  return null;
};
