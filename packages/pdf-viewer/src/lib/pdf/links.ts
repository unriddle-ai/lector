import { type PDFDocumentProxy } from "pdfjs-dist";
import { RefProxy } from "pdfjs-dist/types/src/display/api";
import { IPDFLinkService } from "pdfjs-dist/types/web/interfaces";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { cancellable } from "./utils";
import { usePDF } from "../internal";

// @ts-expect-error TODO: not all methods are implemented
export class LinkService implements IPDFLinkService {
  _pdfDocumentProxy?: PDFDocumentProxy;
  externalLinkEnabled = true;
  isInPresentationMode = false;

  get pdfDocumentProxy(): PDFDocumentProxy {
    if (!this._pdfDocumentProxy) {
      throw new Error("pdfDocumentProxy is not set");
    }

    return this._pdfDocumentProxy;
  }

  constructor() {
    // this.viewportContext = viewportContext;
  }

  get pagesCount() {
    return this.pdfDocumentProxy.numPages;
  }

  getDestinationHash(dest: unknown[]): string {
    return `#dest-${(dest[0] as { gen: number; num: number }).num}`;
  }

  getAnchorUrl(): string {
    return "#";
  }

  addLinkAttributes(
    link: HTMLAnchorElement,
    url: string,
    newWindow?: boolean | undefined,
  ): void {
    link.href = url;
    link.target = newWindow === false ? "" : "_blank";
  }

  async goToDestination(dest: string | unknown[] | Promise<unknown[]>) {
    let explicitDest: unknown[] | null;

    if (typeof dest === "string") {
      explicitDest = await this.pdfDocumentProxy.getDestination(dest);
    } else if (Array.isArray(dest)) {
      explicitDest = dest;
    } else {
      explicitDest = await dest;
    }

    if (!explicitDest) {
      return;
    }

    const explicitRef = explicitDest[0] as RefProxy;

    const page = await this.pdfDocumentProxy.getPageIndex(explicitRef);

    //TODO fix this
    // this.viewportContext.goToPage(page + 1);
  }
}

export const useCreatePDFLinkService = (
  pdfDocumentProxy: PDFDocumentProxy | null,
) => {
  const linkService = useRef<LinkService>(new LinkService());

  useEffect(() => {
    if (pdfDocumentProxy) {
      linkService.current._pdfDocumentProxy = pdfDocumentProxy;
    }
  }, [pdfDocumentProxy]);

  return linkService.current;
};

export const PDFLinkServiceContext = createContext<LinkService | null>(null);

export const usePDFLinkService = () => {
  return useContext(PDFLinkServiceContext);
};

export const usePDFOutline = () => {
  const pdfDocumentProxy = usePDF((state) => state.pdfDocumentProxy);
  const [outline, setOutline] =
    useState<Awaited<ReturnType<PDFDocumentProxy["getOutline"]>>>();

  useEffect(() => {
    const { promise: outline, cancel } = cancellable(
      pdfDocumentProxy.getOutline(),
    );

    outline.then(
      (result) => {
        setOutline(result);
      },
      () => {},
    );

    return () => {
      cancel();
    };
  }, []);

  return outline;
};
