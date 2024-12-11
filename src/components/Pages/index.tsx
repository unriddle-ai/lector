import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";

import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import useVirtualizerVelocity from "./useVirtualizerVelocity";
import { useVisiblePage } from "./useVisiblePage";
import { useScrollFn } from "./useScrollFn";
import { usePDF } from "@/lib/internal";
import { useObserveElement } from "./useObserveElement";

const VIRTUAL_ITEM_GAP = 10;
const DEFAULT_HEIGHT = 600;
const EXTRA_HEIGHT = 0;

export const easeOutQuint = (t: number) => {
  return 1 - Math.pow(1 - t, 5);
};

export interface PagesProps {
  children: ReactElement;
  virtualizerOptions?: {
    overscan?: number;
  };
}
export const Pages = ({
  children,
  virtualizerOptions = { overscan: 10 },
}: PagesProps) => {
  const [tempItems, setTempItems] = useState<VirtualItem[]>([]);

  const numPages = usePDF((state) => state.pdfDocumentProxy.numPages);
  const viewportRef = usePDF((state) => state.viewportRef);
  const isPinching = usePDF((state) => state.isPinching);
  const viewports = usePDF((state) => state.viewports);
  const setVirtualizer = usePDF((state) => state.setVirtualizer);

  const { scrollToFn } = useScrollFn();
  const { observeElementOffset } = useObserveElement();

  const estimateSize = useCallback(
    (index: number) => {
      if (!viewports || !viewports[index]) return DEFAULT_HEIGHT;
      return viewports[index].height + EXTRA_HEIGHT;
    },
    [viewports],
  );

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => viewportRef?.current,
    estimateSize,
    observeElementOffset,
    overscan: virtualizerOptions?.overscan ?? 0,
    scrollToFn,
    gap: VIRTUAL_ITEM_GAP,
  });

  useEffect(() => {
    setVirtualizer(virtualizer);
  }, [setVirtualizer, virtualizer]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const virtualized = virtualizer.getVirtualItems();

    if (!isPinching) {
      virtualizer.measure();

      timeout = setTimeout(() => {
        setTempItems([]);
      }, 200);
    } else if (virtualized.length > 0) {
      setTempItems(virtualizer.getVirtualItems());
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isPinching]);

  const { normalizedVelocity } = useVirtualizerVelocity({
    virtualizer,
    estimateSize,
  });

  const items = tempItems.length ? tempItems : virtualizer.getVirtualItems();

  useVisiblePage({
    items: virtualizer.getVirtualItems(),
  });

  const isScrollingFast = Math.abs(normalizedVelocity) > 1;
  const shouldRender = !isScrollingFast;

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {items.map((virtualItem) => {
        const innerBoxWidth =
          viewports && viewports[virtualItem.index]
            ? viewports[virtualItem.index].width
            : 0;

        return (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: innerBoxWidth,
              height: `${virtualItem.size}px`,
              transform: `translateX(-50%) translateY(${virtualItem.start}px)`,
              background: "white",
            }}
          >
            {cloneElement(children, {
              key: virtualItem.key,
              pageNumber: virtualItem.index + 1,
            })}
          </div>
        );
      })}
    </div>
  );
};
