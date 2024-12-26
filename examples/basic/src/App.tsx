import { CanvasLayer, Page, Pages, Root, TextLayer } from "@unriddle-ai/lector";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

function App() {
  return (
    <div className='bg-gray-100 w-full max-w-2xl mx-auto'>
      <Root
        fileURL='/sample.pdf'
        className='h-[700px] w-full border overflow-hidden rounded-lg'
        loader={<div className='p-4'>Loading...</div>}>
        <Pages>
          <Page>
            <CanvasLayer />
            <TextLayer />
          </Page>
        </Pages>
      </Root>
    </div>
  );
}

export default App;
