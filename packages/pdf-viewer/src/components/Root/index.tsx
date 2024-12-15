import {
  usePDFDocumentParams,
  usePDFDocumentContext,
} from "@/lib/pdf/document";

import { forwardRef, HTMLProps, ReactNode } from "react";
import { Primitive } from "../Primitive";
import { PDFStore } from "@/lib/internal";

export const Root = forwardRef(
  (
    {
      children,
      fileURL,
      loader,
      onDocumentLoad,
      isZoomFitWidth,
      ...props
    }: HTMLProps<HTMLDivElement> &
      usePDFDocumentParams & {
        loader?: ReactNode;
      },
    ref,
  ) => {
    const { initialState } = usePDFDocumentContext({
      fileURL,
      onDocumentLoad,
      isZoomFitWidth,
    });

    return (
      <Primitive.div ref={ref} {...props}>
        {initialState ? (
          <PDFStore.Provider initialValue={initialState}>
            {children}
          </PDFStore.Provider>
        ) : (
          loader || "Loading..."
        )}
      </Primitive.div>
    );
  },
);
