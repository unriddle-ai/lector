import { HTMLProps, useEffect, useRef, useState } from "react";
import { Primitive } from "../Primitive";
import { usePDF } from "@/lib/internal";

export const ZoomIn = ({ ...props }: HTMLProps<HTMLButtonElement>) => {
  const setZoom = usePDF((state) => state.updateZoom);

  return (
    <Primitive.button
      {...props}
      onClick={(e: any) => {
        props.onClick && props.onClick(e);
        setZoom((zoom) => Number((zoom + 0.1).toFixed(1)));
      }}
    />
  );
};

export const ZoomOut = ({ ...props }: HTMLProps<HTMLButtonElement>) => {
  const setZoom = usePDF((state) => state.updateZoom);

  return (
    <Primitive.button
      {...props}
      onClick={(e: any) => {
        props.onClick && props.onClick(e);
        setZoom((zoom) => Number((zoom - 0.1).toFixed(1)));
      }}
    />
  );
};

export const CurrentZoom = ({ ...props }: HTMLProps<HTMLInputElement>) => {
  const setRealZoom = usePDF((state) => state.updateZoom);
  const realZoom = usePDF((state) => state.zoom);

  const [zoom, setZoom] = useState<string>((realZoom * 100).toFixed(0));
  const isSelected = useRef<boolean>(false);

  useEffect(() => {
    if (isSelected.current) {
      return;
    }

    setZoom((realZoom * 100).toFixed(0));
  }, [realZoom, isSelected.current]);

  return (
    <input
      {...props}
      value={zoom}
      onClick={() => (isSelected.current = true)}
      onChange={(e) => {
        setRealZoom(Number(e.target.value) / 100);
        setZoom(e.target.value);
      }}
      onBlur={() => {
        isSelected.current = false;

        setZoom((realZoom * 100).toFixed(0));
      }}
    />
  );
};
