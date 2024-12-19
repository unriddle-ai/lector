import {
  cloneElement,
  useCallback,
  type FunctionComponent,
  type HTMLProps,
  type ReactElement,
} from "react";
import { Primitive } from "./primitive";
import { usePdf } from "../internal";
import { usePdfJump } from "../hooks/pages/usePdfJump";
import type { RefProxy } from "pdfjs-dist/types/src/display/api";
import { usePDFOutline } from "../hooks/usePdfOutline";

type OutlineItemType = NonNullable<ReturnType<typeof usePDFOutline>>[number];

export const OutlineChildItems = ({
  ...props
}: HTMLProps<HTMLUListElement> & {
  children?: ReactElement<typeof OutlineItem>[];
}) => {
  return <Primitive.ul {...props} />;
};

interface OutlineItemProps extends HTMLProps<HTMLDivElement> {
  level?: number;
  item?: OutlineItemType;
  children?: ReactElement<typeof OutlineChildItems>;
  outlineItem?: ReactElement<typeof OutlineItem>;
}

export const OutlineItem: FunctionComponent<OutlineItemProps> = ({
  level = 0,
  item,
  children,
  outlineItem,
  ...props
}: OutlineItemProps) => {
  if (!item || !outlineItem || !children) {
    throw new Error("Outline item is required");
  }

  const pdfDocumentProxy = usePdf((state) => state.pdfDocumentProxy);
  const { jumpToPage } = usePdfJump();

  const getDestinationPage = async (
    dest: string | unknown[] | Promise<unknown[]>,
  ) => {
    let explicitDest: unknown[] | null;

    if (typeof dest === "string") {
      explicitDest = await pdfDocumentProxy.getDestination(dest);
    } else if (Array.isArray(dest)) {
      explicitDest = dest;
    } else {
      explicitDest = await dest;
    }

    if (!explicitDest) {
      return;
    }

    const explicitRef = explicitDest[0] as RefProxy;

    const page = await pdfDocumentProxy.getPageIndex(explicitRef);

    return page;
  };

  const navigate = useCallback(() => {
    if (!item.dest) {
      return;
    }

    getDestinationPage(item.dest).then((page) => {
      if (!page) {
        return;
      }

      jumpToPage(page, { behavior: "smooth" });
    });
  }, [item.dest, getDestinationPage]);

  return (
    <Primitive.li {...props}>
      <a
        role="button"
        tabIndex={0}
        onClick={navigate}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            navigate();
          }
        }}
        data-level={level}
      >
        {item.title}
      </a>
      {item.items &&
        item.items.length > 0 &&
        cloneElement(children, {
          // @ts-expect-error
          children: item.items.map((item, index) =>
            cloneElement(outlineItem, {
              // @ts-expect-error
              level: level + 1,
              item,
              outlineItem,
              key: index,
            }),
          ),
        })}
    </Primitive.li>
  );
};

export const Outline = ({
  children,
  ...props
}: HTMLProps<HTMLUListElement> & {
  children: ReactElement<typeof OutlineItem>;
}) => {
  const outline = usePDFOutline();

  return (
    <Primitive.ul {...props}>
      {outline &&
        outline.map((item: OutlineItemType, idx) => {
          return cloneElement(children, {
            key: idx,
            item,
            outlineItem: children,
          } as OutlineItemProps);
        })}
    </Primitive.ul>
  );
};