import { useDebounce } from "@uidotdev/usehooks";
import { useLayoutEffect, useRef } from "react";

import { useDPR, useVisibility } from "@/lib/viewport";
import { usePDF } from "@/lib/internal";
import { usePDFPageNumber } from "../page";

export const useCanvasLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageNumber = usePDFPageNumber();

  const dpr = useDPR();

  const bouncyZoom = usePDF((state) => state.zoom);
  const pdfPageProxy = usePDF((state) => state.getPdfPageProxy(pageNumber));

  const zoom = useDebounce(bouncyZoom, 100);

  // const { visible } = useVisibility({ elementRef: canvasRef });
  // const debouncedVisible = useDebounce(visible, 100);

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const viewport = pdfPageProxy.getViewport({ scale: 1 });

    const canvas = canvasRef.current;

    const scale = dpr * zoom;

    canvas.height = viewport.height * scale;
    canvas.width = viewport.width * scale;

    canvas.style.height = `${viewport.height}px`;
    canvas.style.width = `${viewport.width}px`;

    const canvasContext = canvas.getContext("2d")!;
    canvasContext.scale(scale, scale);

    const renderingTask = pdfPageProxy.render({
      canvasContext: canvasContext,
      viewport,
    });

    renderingTask.promise.catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === "RenderingCancelledException") {
        return;
      }

      throw error;
    });

    return () => {
      void renderingTask.cancel();
    };
  }, [pdfPageProxy, canvasRef.current, dpr, zoom]);

  return {
    canvasRef,
  };
};
