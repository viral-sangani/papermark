// Stub for open-source build: enterprise branding feature not included.
//
// Provides a static demo dataset (folders + documents) for the branding
// preview iframes so they render a representative dataroom without depending on
// real team data. Shapes match what `room_ppreview_demo` feeds into
// `FolderCard`, `DocumentCard` and `ViewFolderTree`.

import type { DataroomFolder } from "@prisma/client";

import type { DocumentVersion } from "@/components/view/viewer/dataroom-viewer";

export type PreviewDocument = {
  id: string;
  name: string;
  dataroomDocumentId: string;
  /** Name of the containing folder, or null for the dataroom root. */
  folderName: string | null;
  downloadOnly: boolean;
  canDownload: boolean;
  hierarchicalIndex: string | null;
  versions: DocumentVersion[];
};

export type DataroomPreviewDataset = {
  folders: DataroomFolder[];
  documents: PreviewDocument[];
};

const PREVIEW_NOW = new Date("2026-01-01T00:00:00.000Z");

function makeFolder(
  partial: Pick<DataroomFolder, "id" | "name" | "parentId"> &
    Partial<DataroomFolder>,
): DataroomFolder {
  return {
    icon: null,
    color: null,
    path: `/${partial.name.toLowerCase().replace(/\s+/g, "-")}`,
    dataroomId: "preview-dataroom",
    orderIndex: null,
    hierarchicalIndex: null,
    createdAt: PREVIEW_NOW,
    updatedAt: PREVIEW_NOW,
    ...partial,
  };
}

function makeVersion(): DocumentVersion {
  return {
    id: "preview-version",
    type: "pdf",
    versionNumber: 1,
    hasPages: true,
    isVertical: true,
    updatedAt: PREVIEW_NOW,
    fileSize: 1024 * 512,
  };
}

function makeDocument(
  partial: Pick<PreviewDocument, "id" | "name"> & Partial<PreviewDocument>,
): PreviewDocument {
  return {
    dataroomDocumentId: partial.id,
    folderName: null,
    downloadOnly: false,
    canDownload: true,
    hierarchicalIndex: null,
    versions: [{ ...makeVersion(), id: `${partial.id}-v1` }],
    ...partial,
  };
}

/**
 * Returns the canonical "Example Virtual Data Room" preview dataset. Stable
 * across all branding preview pages.
 */
export function getDataroomPreviewDataset(): DataroomPreviewDataset {
  const folders: DataroomFolder[] = [
    makeFolder({
      id: "preview-folder-financials",
      name: "Financials",
      parentId: null,
      hierarchicalIndex: "1",
    }),
    makeFolder({
      id: "preview-folder-legal",
      name: "Legal",
      parentId: null,
      hierarchicalIndex: "2",
    }),
    makeFolder({
      id: "preview-folder-product",
      name: "Product",
      parentId: null,
      hierarchicalIndex: "3",
    }),
  ];

  const documents: PreviewDocument[] = [
    makeDocument({
      id: "preview-doc-overview",
      name: "Company Overview.pdf",
      folderName: null,
      hierarchicalIndex: "4",
    }),
    makeDocument({
      id: "preview-doc-pitch",
      name: "Pitch Deck.pdf",
      folderName: null,
      hierarchicalIndex: "5",
    }),
    makeDocument({
      id: "preview-doc-financial-model",
      name: "Financial Model.xlsx",
      folderName: "Financials",
      hierarchicalIndex: "1.1",
    }),
    makeDocument({
      id: "preview-doc-cap-table",
      name: "Cap Table.xlsx",
      folderName: "Financials",
      hierarchicalIndex: "1.2",
    }),
    makeDocument({
      id: "preview-doc-incorporation",
      name: "Certificate of Incorporation.pdf",
      folderName: "Legal",
      hierarchicalIndex: "2.1",
    }),
    makeDocument({
      id: "preview-doc-roadmap",
      name: "Product Roadmap.pdf",
      folderName: "Product",
      hierarchicalIndex: "3.1",
    }),
  ];

  return { folders, documents };
}
