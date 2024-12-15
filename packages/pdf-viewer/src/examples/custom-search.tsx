import { SearchResult, useSearch } from "@/components/Search/useSearch";
import { calculateHighlightRects } from "@/components/Search/useSearchPosition";
import { usePDF } from "@/lib/internal";
import { usePDFJump } from "@/lib/pages";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

interface ResultItemProps {
  result: SearchResult;
}

const ResultItem = ({ result }: ResultItemProps) => {
  const { jumpToHighlightRects } = usePDFJump();
  const getPdfPageProxy = usePDF((state) => state.getPdfPageProxy);

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
      <div className="flex items-center gap-4 flex-shrink-0 text-sm text-gray-500">
        {!result.isExactMatch && (
          <span>{(result.score * 100).toFixed()}% match</span>
        )}
        <span className="ml-auto">Page {result.pageNumber}</span>
      </div>
    </div>
  );
};

interface ResultGroupProps {
  title: string;
  results: SearchResult[];
}

const ResultGroup = ({ title, results }: ResultGroupProps) => {
  if (!results.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="divide-y divide-gray-100">
        {results.map((result) => (
          <ResultItem
            key={`${result.pageNumber}-${result.matchIndex}`}
            result={result}
          />
        ))}
      </div>
    </div>
  );
};

interface SearchResultsProps {
  searchText: string;
  results: {
    exactMatches: SearchResult[];
    fuzzyMatches: SearchResult[];
    hasMoreResults: boolean;
  };
}

export const SearchResults = ({ searchText, results }: SearchResultsProps) => {
  if (!searchText) return null;

  if (!results.exactMatches.length && !results.fuzzyMatches.length) {
    return (
      <div className="text-center py-4 text-gray-500">No results found</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ResultGroup title="Exact Matches" results={results.exactMatches} />
      <ResultGroup title="Similar Matches" results={results.fuzzyMatches} />

      {results.hasMoreResults && (
        <div className="text-center text-sm text-blue-500">
          More results available
        </div>
      )}
    </div>
  );
};
// Main Search UI component
export function SearchUI() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const { searchResults: results, search } = useSearch();

  useEffect(() => {
    search(debouncedSearchText);
  }, [debouncedSearchText]);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <div className="flex flex-col gap-4 w-64 px-4 flex-shrink-0">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchText || ""}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search in document..."
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <SearchResults searchText={searchText} results={results} />
    </div>
  );
}
