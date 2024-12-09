import type { Meta, StoryObj } from "@storybook/react";

import {
  AnnotationLayer,
  CanvasLayer,
  CurrentPage,
  CustomLayer,
  HighlightLayer,
  HighlightArea,
  Outline,
  OutlineChildItems,
  OutlineItem,
  Page,
  Pages,
  Root,
  SelectionTooltip,
  TextLayer,
  Thumbnail,
  Thumbnails,
  Viewport,
} from "@/components";
import { CurrentZoom, ZoomIn, ZoomOut } from "@/components/Controls/Zoom";
import { useState } from "react";
import clsx from "clsx";
import { useSelectionDimensions } from "@/hooks/useSelectionDimensions";

const meta: Meta<typeof Root> = {
  title: "Viewer",
  component: Root,
};
export default meta;

type Story = StoryObj<typeof Root>;

export const Basic: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithTextLayer: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithInternalLinks: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithAnnotationLayer: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithFormControls: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "form.pdf",
  },
};

export const WithPageControl: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px] flex flex-col justify-stretch"
      loader={<div className="p-4">Loading...</div>}
    >
      <div className="bg-gray-100 border-b p-1 flex items-center justify-center text-sm text-gray-600 gap-2">
        Page
        <CurrentPage className="bg-white rounded-full px-3 py-1 border text-center" />
      </div>
      <Viewport className="p-4">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "large.pdf",
  },
};

export const WithZoomControl: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px] flex flex-col justify-stretch"
      loader={<div className="p-4">Loading...</div>}
    >
      <div className="bg-gray-100 border-b p-1 flex items-center justify-center text-sm text-gray-600 gap-2">
        Zoom
        <ZoomOut className="px-3 py-1 -mr-2 text-gray-900">-</ZoomOut>
        <CurrentZoom className="bg-white rounded-full px-3 py-1 border text-center w-16" />
        <ZoomIn className="px-3 py-1 -ml-2 text-gray-900">+</ZoomIn>
      </div>
      <Viewport className="p-4">
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
            <AnnotationLayer />
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithOutline: Story = {
  render: ({ fileURL }: { fileURL: string }) => {
    const [showOutline, setShowOutline] = useState(true);

    return (
      <Root
        fileURL={fileURL}
        className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px] flex flex-col justify-stretch"
        loader={<div className="p-4">Loading...</div>}
      >
        <div className="bg-gray-100 border-b p-1 flex items-center justify-center text-sm text-gray-600 gap-2">
          <button
            onClick={() => setShowOutline((showOutline) => !showOutline)}
            className="px-2 hover:bg-gray-300 hover:text-gray-900 py-1 rounded-full"
          >
            {showOutline ? "Hide" : "Show"} Outline
          </button>
          <span className="flex-grow" />
          Page
          <CurrentPage className="bg-white rounded-full px-3 py-1 border text-center" />
          Zoom
          <ZoomOut className="px-3 py-1 -mr-2 text-gray-900">-</ZoomOut>
          <CurrentZoom className="bg-white rounded-full px-3 py-1 border text-center w-16" />
          <ZoomIn className="px-3 py-1 -ml-2 text-gray-900">+</ZoomIn>
          <span className="flex-grow" />
        </div>
        <div
          className={clsx(
            "basis-0 grow min-h-0 relative grid",
            "transition-all duration-300",
            showOutline ? "grid-cols-[24rem,1fr]" : "grid-cols-[0,1fr]",
          )}
        >
          <div className="overflow-y-auto">
            <div className="w-96 overflow-x-auto">
              <Outline className="border-r overflow-auto p-3">
                <OutlineItem className="text-sm [&>a]:py-1 [&>a]:block [&>a:hover]:underline">
                  <OutlineChildItems className="pl-4" />
                </OutlineItem>
              </Outline>
            </div>
          </div>
          <Viewport className="p-4 h-full">
            <Pages>
              <Page>
                <CanvasLayer />
                <TextLayer />
                <AnnotationLayer />
              </Page>
            </Pages>
          </Viewport>
        </div>
      </Root>
    );
  },
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithThumbnails: Story = {
  render: ({ fileURL }: { fileURL: string }) => {
    const [showThumbnails, setShowThumbnails] = useState(true);

    return (
      <Root
        fileURL={fileURL}
        className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px] flex flex-col justify-stretch"
        loader={<div className="p-4">Loading...</div>}
      >
        <div className="bg-gray-100 border-b p-1 flex items-center justify-center text-sm text-gray-600 gap-2">
          <button
            onClick={() => setShowThumbnails((showOutline) => !showOutline)}
            className="px-2 hover:bg-gray-300 hover:text-gray-900 py-1 rounded-full"
          >
            {showThumbnails ? "Hide" : "Show"} Thumbnails
          </button>
          <span className="flex-grow" />
          Page
          <CurrentPage className="bg-white rounded-full px-3 py-1 border text-center" />
          Zoom
          <ZoomOut className="px-3 py-1 -mr-2 text-gray-900">-</ZoomOut>
          <CurrentZoom className="bg-white rounded-full px-3 py-1 border text-center w-16" />
          <ZoomIn className="px-3 py-1 -ml-2 text-gray-900">+</ZoomIn>
          <span className="flex-grow" />
        </div>
        <div
          className={clsx(
            "basis-0 grow min-h-0 relative grid",
            "transition-all duration-300",
            showThumbnails ? "grid-cols-[24rem,1fr]" : "grid-cols-[0,1fr]",
          )}
        >
          <div className="overflow-y-auto overflow-x-hidden">
            <div className="w-96 overflow-x-hidden">
              <Thumbnails className="flex flex-col gap-4 items-center py-4">
                <Thumbnail className="transition-all w-48 hover:shadow-lg hover:outline hover:outline-gray-300" />
              </Thumbnails>
            </div>
          </div>
          <Viewport className="p-4 h-full">
            <Pages>
              <Page>
                <CanvasLayer />
                <TextLayer />
                <AnnotationLayer />
              </Page>
            </Pages>
          </Viewport>
        </div>
      </Root>
    );
  },
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithCustomLayer: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <Root
      fileURL={fileURL}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
      loader={<div className="p-4">Loading...</div>}
    >
      <Viewport className="p-4 h-full">
        <Pages>
          <Page>
            <CanvasLayer />
            <CustomLayer>
              {(pageNumber) => {
                return (
                  <div className="relative">
                    <p className="bg-white border p-2">
                      This is page {pageNumber}
                    </p>
                  </div>
                );
              }}
            </CustomLayer>
          </Page>
        </Pages>
      </Viewport>
    </Root>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithHighlightLayer: Story = {
  render: ({ fileURL }: { fileURL: string }) => {
    const [highlights, setHighlights] = useState<HighlightArea[]>([]);

    const { getDimension } = useSelectionDimensions();

    return (
      <Root
        highlights={highlights}
        fileURL={fileURL}
        className="bg-gray-100 border rounded-md overflow-hidden relative h-[700px]"
        loader={<div className="p-4">Loading...</div>}
      >
        <Viewport className="p-4 h-full">
          <Pages>
            <Page>
              <CanvasLayer />
              <TextLayer />
              <HighlightLayer className="bg-blue-200/70" />
            </Page>
          </Pages>
          <SelectionTooltip>
            <button
              onClick={() => {
                const dimensions = getDimension();
                if (!dimensions) return;

                setHighlights(dimensions.highlights);
              }}
              className="bg-gray-50 px-2 py-1 text-sm rounded-md hover:bg-gray-100"
            >
              Highlight
            </button>
          </SelectionTooltip>
        </Viewport>
      </Root>
    );
  },
  args: {
    fileURL: "large.pdf",
  },
};
export const WithCustomFormLayer: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);
        const values = Object.fromEntries(formData.entries());

        alert(`Form values:\n${JSON.stringify(values, null, 2)}`);
      }}
    >
      <button type="submit">Get form values</button>
      <Root
        fileURL={fileURL}
        className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
        loader={<div className="p-4">Loading...</div>}
      >
        <Viewport className="p-4 h-full">
          <Pages>
            <Page>
              <CanvasLayer />
              <CustomLayer>
                {(pageNumber) => {
                  return (
                    <div className="relative">
                      <input
                        name={`${pageNumber}-input`}
                        className="p-2 border rounded-md m-2"
                        placeholder={`Input for page ${pageNumber}`}
                        type="text"
                      />
                    </div>
                  );
                }}
              </CustomLayer>
            </Page>
          </Pages>
        </Viewport>
      </Root>
    </form>
  ),
  args: {
    fileURL: "brochure.pdf",
  },
};

export const WithPDFFormValues: Story = {
  render: ({ fileURL }: { fileURL: string }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);
        const values = Object.fromEntries(formData.entries());

        alert(`Form values:\n${JSON.stringify(values, null, 2)}`);
      }}
    >
      <button type="submit">Get form values</button>
      <Root
        fileURL={fileURL}
        className="bg-gray-100 border rounded-md overflow-hidden relative h-[500px]"
        loader={<div className="p-4">Loading...</div>}
      >
        <Viewport className="p-4 h-full">
          <Pages>
            <Page>
              <CanvasLayer />
              <TextLayer />
              <AnnotationLayer />
            </Page>
          </Pages>
        </Viewport>
      </Root>
    </form>
  ),
  args: {
    fileURL: "form.pdf",
  },
};
