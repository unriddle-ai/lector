import "pdfjs-dist/web/pdf_viewer.css";
import { Root } from "./Root";
import { Page } from "./Page";
import { AnnotationLayer, CanvasLayer, TextLayer, CustomLayer } from "./Layers";
import { Outline, OutlineChildItems, OutlineItem } from "./Outline";
import { Pages } from "./Pages";
import { CurrentPage, TotalPages } from "./Controls/PageNumber";
import { CurrentZoom, ZoomIn, ZoomOut } from "./Controls/Zoom";
import { Thumbnail, Thumbnails } from "./Thumbnails";
import { usePDF } from "@/lib/internal";
export { HighlightLayer } from "./Highlight";
export { SelectionTooltip } from "./Tooltip";
import { Search } from "./Search";
import { CustomSelection } from "./Highlight/CustomSelection";
import { CustomSelectionTrigger } from "./Highlight/CustomSelectionTrigger";

export const Debug = () => {
  const { zoom, currentPage } = usePDF((state) => ({
    zoom: state.zoom,
    currentPage: state.currentPage,
  }));

  return (
    <div className="flex">
      <div>zoom: {zoom}</div>
      <div>Current page: {currentPage}</div>
    </div>
  );
};

export const Example = ({ fileURL }: { fileURL: string }) => {
  return (
    <Root fileURL={fileURL} className="m-4 border rounded-xl overflow-hidden">
      <div className="border-b p-3 flex gap-4">
        <div className="flex items-center gap-2">
          <CurrentPage className="w-8" />
          of
          <TotalPages />
        </div>
        <div className="flex border rounded-md">
          <ZoomOut className="aspect-square block h-8 w-8">-</ZoomOut>
          <CurrentZoom className="py-1 px-2 bg-white" />
          <ZoomIn className="aspect-square block h-8 w-8">+</ZoomIn>
        </div>
      </div>
      <div className="grid grid-cols-[24rem,1fr] h-[500px] overflow-hidden">
        {/**<Outline className="border-r overflow-auto p-3">
          <OutlineItem className="block">
            <OutlineChildItems className="pl-4" />
          </OutlineItem>
        </Outline> */}
        <Thumbnails className="flex flex-col items-center gap-y-4 p-4 border-r overflow-auto relative bg-gray-300">
          <Thumbnail className="w-[80%] shadow-md" />
        </Thumbnails>
        <Pages className="bg-gray-100 py-4">
          <Page className="shadow-xl m-8 my-4 first:mt-8 outline outline-black/5 rounded-md overflow-hidden">
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </div>
    </Root>
  );
};

export {
  Root,
  Page,
  AnnotationLayer,
  CanvasLayer,
  TextLayer,
  CustomLayer,
  Outline,
  OutlineChildItems,
  OutlineItem,
  Pages,
  CurrentPage,
  TotalPages,
  CurrentZoom,
  ZoomIn,
  ZoomOut,
  Thumbnail,
  Thumbnails,
  Search,
  CustomSelection,
  CustomSelectionTrigger,
};
