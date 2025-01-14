import {
  getDocument,
  type OnProgressParameters,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist";
import { useEffect, useState } from "react";

import type { InitialPDFState } from "../../internal";

export interface usePDFDocumentParams {
  /**
   * The URL of the PDF file to load.
   */
  fileURL: string;
  onDocumentLoad?: ({
    proxy,
    documentUrl,
  }: {
    proxy: PDFDocumentProxy;
    documentUrl: string;
  }) => void;
  initialRotation?: number;
  isZoomFitWidth?: boolean;
}

export const usePDFDocumentContext = ({
  onDocumentLoad,
  fileURL,
  initialRotation = 0,
  isZoomFitWidth,
}: usePDFDocumentParams) => {
  const [_, setProgress] = useState(0);

  const [initialState, setInitialState] = useState<InitialPDFState | null>();
  const [rotation] = useState<number>(initialRotation);

  useEffect(() => {
    const generateViewports = async (pdf: PDFDocumentProxy) => {
      const pageProxies: Array<PDFPageProxy> = [];
      const rotations: number[] = [];
      const viewports = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          // sometimes there is information about the default rotation of the document
          // stored in page.rotate. we need to always add that additional rotaton offset
          const deltaRotate = page.rotate || 0;
          const viewport = page.getViewport({
            scale: 1,
            rotation: rotation + deltaRotate,
          });
          pageProxies.push(page);
          rotations.push(page.rotate);
          return viewport;
        }),
      );

      const sortedPageProxies = pageProxies.sort((a, b) => {
        return a.pageNumber - b.pageNumber;
      });
      setInitialState({
        isZoomFitWidth,
        viewports,
        pageProxies: sortedPageProxies,
        pdfDocumentProxy: pdf,
      });
    };

    const loadDocument = () => {
      setInitialState(null);
      setProgress(0);

      const loadingTask = getDocument(fileURL);

      loadingTask.onProgress = (progressEvent: OnProgressParameters) => {
        // Added to dedupe state updates when the file is fully loaded
        if (progressEvent.loaded === progressEvent.total) {
          return;
        }

        setProgress(progressEvent.loaded / progressEvent.total);
      };

      const loadingPromise = loadingTask.promise
        .then((proxy) => {
          onDocumentLoad?.({ proxy, documentUrl: fileURL });
          setProgress(1);

          generateViewports(proxy);
        })
        .catch((error) => {
          if (loadingTask.destroyed) {
            return;
          }

          console.error("Error loading PDF document", error);
        });

      return () => {
        loadingPromise.finally(() => loadingTask.destroy());
      };
    };
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileURL]);

  return {
    initialState,
  };
};
