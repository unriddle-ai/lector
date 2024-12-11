import { createStore, useStore } from "zustand";
import { createZustandContext } from "./zustand";
import { PageViewport, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { clamp } from "./viewport/utils";
import { createRef } from "react";
import { Virtualizer } from "@tanstack/react-virtual";
import { getFitWidthZoom } from "./zoom";

type TextContent = {
  pageNumber: number;
  text: string;
};

export type HighlightRect = {
  pageNumber: number;
  top: number;
  left: number;
  height: number;
  width: number;
};

export type HighlightArea = {
  pageNumber: number;
  rects: HighlightRect[];
};
interface PDFState {
  pdfDocumentProxy: PDFDocumentProxy;

  zoom: number;
  updateZoom: (zoom: number | ((prevZoom: number) => number)) => void;

  zoomFitWidth: () => void;

  isPinching: boolean;
  setIsPinching: (isPinching: boolean) => void;

  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;

  viewports: Array<PageViewport>;
  viewportRef: React.MutableRefObject<HTMLDivElement | null>;
  defaultViewportWidth: number;

  pageProxies: PDFPageProxy[];

  textContent: TextContent[];
  setTextContent: (textContents: TextContent[]) => void;

  zoomOptions: {
    minZoom: number;
    maxZoom: number;
  };

  virtualizer: PDFVirtualizer | null;
  setVirtualizer: (virtualizer: PDFVirtualizer) => void;

  highlights: HighlightArea[];
  setHighlight: (higlights: HighlightArea[]) => void;

  getPdfPageProxy: (pageNumber: number) => PDFPageProxy;
}

export type PDFVirtualizer = Virtualizer<any, any>;

export type InitialPDFState = Pick<
  PDFState,
  "pdfDocumentProxy" | "pageProxies" | "viewports" | "defaultViewportWidth"
>;

export const PDFStore = createZustandContext(
  (initialState: InitialPDFState) => {
    return createStore<PDFState>((set, get) => ({
      pdfDocumentProxy: initialState.pdfDocumentProxy,

      defaultViewportWidth: initialState.defaultViewportWidth,
      zoom: 1,
      zoomOptions: {
        minZoom: 0.5,
        maxZoom: 10,
      },

      viewportRef: createRef<HTMLDivElement>(),
      viewports: initialState.viewports,

      updateZoom: (zoom) => {
        const { minZoom, maxZoom } = get().zoomOptions;
        set((state) => {
          if (typeof zoom === "function") {
            const newZoom = clamp(zoom(state.zoom), minZoom, maxZoom);
            return { zoom: newZoom };
          }
          const newZoom = clamp(zoom, minZoom, maxZoom);
          return { zoom: newZoom };
        });
      },
      zoomFitWidth: () => {
        const { viewportRef, zoomOptions, viewports } = get();

        if (!viewportRef.current) return;

        const clampedZoom = getFitWidthZoom(
          viewportRef.current.clientWidth,
          viewports,
          zoomOptions,
        );

        set(() => {
          return { zoom: clampedZoom, fitWidthZoom: clampedZoom };
        });

        return clampedZoom;
      },

      currentPage: 1,
      setCurrentPage: (val) => {
        set({
          currentPage: val,
        });
      },

      isPinching: false,
      setIsPinching: (val) => {
        set({
          isPinching: val,
        });
      },

      virtualizer: null,
      setVirtualizer: (val) => {
        set({
          virtualizer: val,
        });
      },

      pageProxies: initialState.pageProxies,
      getPdfPageProxy: (pageNumber) => {
        const proxy = get().pageProxies[pageNumber - 1];
        return proxy;
      },

      textContent: [],
      setTextContent: (val) => {
        set({
          textContent: val,
        });
      },
      highlights: [],
      setHighlight: (val) => {
        set({
          highlights: val,
        });
      },
    }));
  },
);

export const usePDF = <T>(selector: (state: PDFState) => T) =>
  useStore(PDFStore.useContext(), selector);
