import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useGesture } from "@use-gesture/react";
import { clamp, firstMemo } from "./utils";
import { usePDF } from "../internal";

export const useViewportContainer = ({
  containerRef,
  elementWrapperRef,
  elementRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
  elementWrapperRef: RefObject<HTMLDivElement>;
  elementRef: RefObject<HTMLDivElement>;
}) => {
  const [origin, setOrigin] = useState<[number, number]>([0, 0]);

  const { maxZoom, minZoom } = usePDF((state) => state.zoomOptions);
  const zoom = usePDF((state) => state.zoom);
  const viewportRef = usePDF((state) => state.viewportRef);

  const setIsPinching = usePDF((state) => state.setIsPinching);
  const updateZoom = usePDF((state) => state.updateZoom);

  useEffect(() => {
    viewportRef.current = containerRef.current;
  }, [containerRef.current]);

  const transformations = useRef<{
    translateX: number;
    translateY: number;
    zoom: number;
  }>({
    translateX: 0,
    translateY: 0,
    zoom,
  });

  const updateTransform = useCallback(() => {
    if (
      !elementRef.current ||
      !containerRef.current ||
      !elementWrapperRef.current
    ) {
      return;
    }

    const { zoom, translateX, translateY } = transformations.current;

    console.log(transformations.current);
    elementRef.current.style.transform = `scale3d(${zoom}, ${zoom}, 1)`;

    const elementBoundingBox = elementRef.current.getBoundingClientRect();

    elementWrapperRef.current.style.width = `${elementBoundingBox.width}px`;
    elementWrapperRef.current.style.height = `${elementBoundingBox.height}px`;

    containerRef.current.scrollTop = translateY;
    containerRef.current.scrollLeft = translateX;

    updateZoom(() => transformations.current.zoom);
  }, [containerRef.current, elementRef.current, updateZoom, zoom]);

  useEffect(() => {
    if (transformations.current.zoom === zoom || !containerRef.current) {
      return;
    }

    const dZoom = zoom / transformations.current.zoom;

    transformations.current = {
      translateX: containerRef.current.scrollLeft * dZoom,
      translateY: containerRef.current.scrollTop * dZoom,
      zoom,
    };

    updateTransform();
  }, [zoom]);

  useEffect(() => {
    if (!elementRef.current || !elementWrapperRef.current) {
      return;
    }

    const callback = (entries: ResizeObserverEntry[]) => {
      if (!elementRef.current || !elementWrapperRef.current) {
        return;
      }

      const elementBoundingBox = entries[0];

      elementWrapperRef.current.style.width = `${elementBoundingBox.contentRect.width}px`;
      elementWrapperRef.current.style.height = `${elementBoundingBox.contentRect.height}px`;
    };

    const resizeObserver = new ResizeObserver(callback);

    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef.current, elementWrapperRef.current]);

  useLayoutEffect(() => {
    updateTransform();
  }, []);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => e.preventDefault();

    // @ts-expect-error Could be null
    document.addEventListener("gesturestart", preventDefault);
    // @ts-expect-error Could be null
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      // @ts-expect-error Could be null
      document.removeEventListener("gesturestart", preventDefault);
      // @ts-expect-error Could be null
      document.removeEventListener("gesturechange", preventDefault);
    };
  });

  useGesture(
    {
      onPinch: ({ origin, first, movement: [ms], memo }) => {
        const newMemo = firstMemo(first, memo, () => {
          const elementRect = elementRef.current!.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();

          const contentPosition: [number, number] = [
            origin[0] - elementRect.left,
            origin[1] - elementRect.top,
          ];

          const containerPosition: [number, number] = [
            origin[0] - containerRect.left,
            origin[1] - containerRect.top,
          ];

          setOrigin([
            contentPosition[0] / transformations.current.zoom,
            contentPosition[1] / transformations.current.zoom,
          ]);

          return {
            contentPosition,
            containerPosition,
            originZoom: transformations.current.zoom,
            originTranslate: transformations.current.translateY,
          };
        });

        const newZoom = clamp(ms * newMemo.originZoom, minZoom, maxZoom);

        const realMs = newZoom / newMemo.originZoom;

        const newTranslateX =
          newMemo.contentPosition[0] * realMs - newMemo.containerPosition[0];
        const newTranslateY =
          newMemo.contentPosition[1] * realMs - newMemo.containerPosition[1];

        transformations.current = {
          zoom: newZoom,
          translateX: newTranslateX,
          translateY: newTranslateY,
        };

        updateTransform();

        return newMemo;
      },
      onPinchStart: () => setIsPinching(true),
      onPinchEnd: () => setIsPinching(false),
    },
    {
      target: containerRef,
    },
  );

  return {
    origin,
  };
};
