import {
  getDocument,
  GlobalWorkerOptions,
  OnProgressParameters,
  PageViewport,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";
// @ts-expect-error Vite Worker
import PDFWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url&inline";
import { useEffect, useMemo, useRef, useState } from "react";
import { InitialPDFState } from "../internal";

/**
 * General setup for pdf.js
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
GlobalWorkerOptions.workerSrc = PDFWorker;

/**
 * Load a document
 */
export interface usePDFDocumentParams {
  /**
   * The URL of the PDF file to load.
   */
  fileURL: string;
  onDocumentLoad?: (url: string) => void;
  initialRotation?: number;
}

export const usePDFDocumentContext = ({
  onDocumentLoad,
  fileURL,
  initialRotation = 0,
}: usePDFDocumentParams) => {
  const [progress, setProgress] = useState(0);

  const [initialState, setInitialState] = useState<InitialPDFState | null>();
  const [rotation, setRotation] = useState<number>(initialRotation);

  useEffect(() => {
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

    loadingTask.promise.then(
      (proxy) => {
        onDocumentLoad?.(fileURL);
        setProgress(1);

        generateViewports(proxy);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error("Error loading PDF document", error);
      },
    );

    return () => {
      void loadingTask.destroy();
    };
  }, [fileURL]);

  const generateViewports = async (pdf: PDFDocumentProxy) => {
    let pageProxies: Array<PDFPageProxy> = [];
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

    const largestViewportWidth = Math.max(
      ...viewports.map((viewport) => viewport.width),
    );

    setInitialState({
      viewports,
      defaultViewportWidth: largestViewportWidth,
      // defaultRotations: rotations,
      pageProxies,
      pdfDocumentProxy: pdf,
    });
  };

  return {
    initialState,
  };
};
