import {
  AnnotationLayerParams,
  useAnnotationLayer,
} from "@/lib/pdf/layers/annotation";
import { useCanvasLayer } from "@/lib/pdf/layers/canvas";
import { useTextLayer } from "@/lib/pdf/layers/text";
import { usePDFPageNumber } from "@/lib/pdf/page";
import clsx from "clsx";
import { HTMLProps } from "react";

export const TextLayer = ({
  className,
  style,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const { textContainerRef, pageNumber } = useTextLayer();

  return (
    <div
      className={clsx("textLayer", className)}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      {...{
        ["data-page-number"]: pageNumber,
      }}
      ref={textContainerRef}
    />
  );
};

export const AnnotationLayer = ({
  renderForms = true,
  className,
  style,
  ...props
}: AnnotationLayerParams & HTMLProps<HTMLDivElement>) => {
  const { annotationLayerRef } = useAnnotationLayer({
    renderForms,
  });

  return (
    <div
      className={clsx("annotationLayer", className)}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={annotationLayerRef}
    />
  );
};

export const CanvasLayer = ({
  style,
  ...props
}: HTMLProps<HTMLCanvasElement>) => {
  const { canvasRef } = useCanvasLayer();

  return (
    <canvas
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      {...props}
      ref={canvasRef}
    />
  );
};

export const CustomLayer = ({
  children,
}: {
  children: (pageNumber: number) => JSX.Element;
}) => {
  const pageNumber = usePDFPageNumber();

  return children(pageNumber);
};
