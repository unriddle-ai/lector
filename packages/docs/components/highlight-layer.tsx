"use client";

import React from "react";
import {
  CanvasLayer,
  HighlightLayer,
  Page,
  Pages,
  Root,
  TextLayer,
  Search,
} from "@unriddle-ai/lector";
import "@/lib/setup";
import { CustomSelect } from "./custom-select";

const fileUrl = "/pdf/pathways.pdf";

const PdfHighlightLayer = () => (
  <Root
    fileURL={fileUrl}
    className="flex bg-gray-50 h-[500px]"
    loader={<div className="p-4">Loading...</div>}
  >
    <Search>
      <CustomSelect />
      <Pages className="p-4">
        <Page>
          <CanvasLayer />
          <TextLayer />
          <HighlightLayer className="bg-yellow-200/70" />
        </Page>
      </Pages>
    </Search>
  </Root>
);

export default PdfHighlightLayer;
