import { usePDF } from "@/lib/internal";
import { TextLayer } from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { usePDFPageNumber } from "../page";

export const useTextLayer = () => {
  const textContainerRef = useRef<HTMLDivElement>(null);

  const pageNumber = usePDFPageNumber();
  const pdfPageProxy = usePDF((state) => state.getPdfPageProxy(pageNumber));

  useEffect(() => {
    if (!textContainerRef.current) {
      return;
    }

    const textLayer = new TextLayer({
      textContentSource: pdfPageProxy.streamTextContent(),
      container: textContainerRef.current,
      viewport: pdfPageProxy.getViewport({ scale: 1 }),
    });

    void textLayer.render();

    return () => {
      textLayer.cancel();
    };
  }, [pdfPageProxy, textContainerRef.current]);

  return {
    textContainerRef,
    pageNumber: pdfPageProxy.pageNumber,
  };
};
