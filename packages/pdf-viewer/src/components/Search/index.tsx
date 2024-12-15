import { usePDF } from "@/lib/internal";
import { PDFPageProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { useCallback, useEffect, useState } from "react";

interface SearchProps {
  children: React.ReactNode;
  loading?: React.ReactNode;
}

export const Search = ({ children, loading = "Loading..." }: SearchProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const proxies = usePDF((state) => state.pageProxies);
  const setTextContent = usePDF((state) => state.setTextContent);

  const getTextContent = useCallback(
    async (pages: PDFPageProxy[]) => {
      setIsLoading(true);
      const promises = pages.map(async (proxy) => {
        const content = await proxy.getTextContent();
        const text = content.items
          .map((item) => (item as TextItem)?.str || "")
          .join("");

        return Promise.resolve({
          pageNumber: proxy.pageNumber,
          text,
        });
      });
      const text = await Promise.all(promises);

      setIsLoading(false);
      setTextContent(text);
    },
    [setTextContent],
  );

  useEffect(() => {
    getTextContent(proxies);
  }, [proxies]);

  return isLoading ? loading : children;
};
