import { HTMLProps, ReactNode, useRef } from "react";
import { Primitive } from "../Primitive";
import { usePDF } from "@/lib/internal";
import { PDFPageNumberContext } from "@/lib/pdf/page";

export const Page = ({
  children,
  pageNumber = 1,
  style,
  ...props
}: HTMLProps<HTMLDivElement> & {
  children: ReactNode;
  pageNumber?: number;
}) => {
  const pdfPageProxy = usePDF((state) => state.getPdfPageProxy(pageNumber));

  return (
    <PDFPageNumberContext.Provider value={pdfPageProxy.pageNumber}>
      <Primitive.div
        style={{
          display: "block",
        }}
      >
        <div
          style={
            {
              ...style,
              "--scale-factor": 1,
              position: "relative",
              width: `${pdfPageProxy.view[2] - pdfPageProxy.view[0]}px`,
              height: `${pdfPageProxy.view[3] - pdfPageProxy.view[1]}px`,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </Primitive.div>
    </PDFPageNumberContext.Provider>
  );
};
