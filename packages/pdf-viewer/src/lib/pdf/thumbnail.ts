import { useDebounce, useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

import { useDPR, useVisibility } from "../viewport";
import { cancellable } from "./utils";
import { usePDF } from "../internal";

export const useThumbnail = (
  pageNumber: number,

  isFirstPage = false,
) => {
  const pageProxy = usePDF((state) => state.getPdfPageProxy(pageNumber));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = useDPR();
  const [simpleRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  const debouncedVisible = useDebounce(!!entry?.isIntersecting, 50);

  const { maxHeight, maxWidth } = Object.assign(
    {
      maxHeight: 800,
      maxWidth: 400,
    },
    {},
  );

  const forcedVisible = isFirstPage ? true : debouncedVisible;

  useEffect(() => {
    const { cancel } = cancellable(
      (async () => {
        //TODO: opitimize this for thumbnails add virtualization too
        if (!canvasRef.current) {
          return;
        }

        const page = pageProxy;
        const viewport = page.getViewport({ scale: 1 });

        const smallestScale = Math.min(
          maxWidth / viewport.width,
          maxHeight / viewport.height,
        );

        const scale = smallestScale * (forcedVisible ? dpr : 0.5);

        const viewportScaled = page.getViewport({ scale });

        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.width = viewportScaled.width;
        canvas.height = viewportScaled.height;

        const renderingTask = page.render({
          canvasContext: canvasRef.current.getContext("2d")!,
          viewport: viewportScaled,
        });

        void renderingTask.promise;
      })(),
    );

    return () => {
      cancel();
    };
  }, [pageNumber, pageProxy, forcedVisible]);

  return {
    canvasRef,
    simpleRef,
    visible: forcedVisible,
  };
};
