import { useViewportContainer } from "@/lib/viewport";
import { HTMLProps, useEffect, useRef } from "react";
import { Primitive } from "../Primitive";
import { usePDF } from "@/lib/internal";

export const Viewport = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
  const fitWidth = usePDF((state) => state.zoomFitWidth);

  const elementWrapperRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useViewportContainer({
    elementRef: elementRef,
    elementWrapperRef: elementWrapperRef,
    containerRef,
  });

  useEffect(() => {
    fitWidth();
  }, [fitWidth]);

  return (
    <Primitive.div
      ref={containerRef}
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        ...props.style,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        ref={elementWrapperRef}
        style={{
          width: "max-content",
        }}
      />
      <div
        ref={elementRef}
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          transformOrigin: "0 0",
          width: "max-content",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </Primitive.div>
  );
};
