import React, { useState } from "react";
import {
  calculateHighlightRects,
  SearchResult,
  usePdf,
  usePdfJump,
  useSearch,
} from "@unriddle-ai/lector";

const importantParagraphs = [
  {
    id: 1,
    title: "Background",
    text: "Background Malignant melanoma of the skin can metastasize through blood vessels and lymphatics. ",
  },
  {
    id: 2,
    title: "Methods",
    text: "Methods: Two patient-derived xenograft (PDX) models (E-13, N-15) and four cell line-derived xenografts (CDX) models (C-10, D-12, R-18, T-22) of human melanoma were included in the study.",
  },
  {
    id: 3,
    title: "Results",
    text: "Results: C-10, D-12, and E-13 tumors disseminated primarily by the hematogenous route and developed pulmonary metastases.",
  },
];

interface ParagraphItemProps {
  title: string;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const ParagraphItem = ({
  title,
  text,
  isActive,
  onClick,
}: ParagraphItemProps) => {
  return (
    <div
      className={`p-3 border rounded cursor-pointer ${
        isActive ? "bg-yellow-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{text}</p>
    </div>
  );
};

interface ResultItemProps {
  result: SearchResult;
}

const ResultItem = ({ result }: ResultItemProps) => {
  const { jumpToHighlightRects } = usePdfJump();
  const getPdfPageProxy = usePdf((state) => state.getPdfPageProxy);

  const onClick = async () => {
    const pageProxy = getPdfPageProxy(result.pageNumber);
    const rects = await calculateHighlightRects(pageProxy, {
      pageNumber: result.pageNumber,
      text: result.text,
      matchIndex: result.matchIndex,
    });
    jumpToHighlightRects(rects, "pixels");
  };

  return (
    <div
      className="flex py-2 hover:bg-gray-50 flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{result.text}</p>
      </div>
      <div className="text-xs text-gray-500">Page {result.pageNumber}</div>
    </div>
  );
};

export function CustomSelect() {
  const { search, searchResults } = useSearch();
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleParagraphClick = async (id: number, text: string) => {
    if (activeId === id) {
      setActiveId(null);
      await search("");
    } else {
      setActiveId(id);
      await search(text);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-64 px-4 flex-shrink-0">
      <h2 className="text-lg font-bold">Important Sections</h2>
      <div className="space-y-4">
        {importantParagraphs.map((paragraph) => (
          <div key={paragraph.id}>
            <ParagraphItem
              title={paragraph.title}
              text={paragraph.text}
              isActive={activeId === paragraph.id}
              onClick={() => handleParagraphClick(paragraph.id, paragraph.text)}
            />
            {activeId === paragraph.id &&
              searchResults.exactMatches.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-yellow-200">
                  {searchResults.exactMatches.map((result) => (
                    <ResultItem
                      key={`${result.pageNumber}-${result.matchIndex}`}
                      result={result}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
