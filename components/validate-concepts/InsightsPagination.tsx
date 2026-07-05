"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface InsightsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InsightsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InsightsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border-light pt-4 mt-2">
      {/* Showing count text */}
      <span className="font-mono text-xs text-text-muted">
        Page <span className="text-text-light">{currentPage}</span> of{" "}
        <span className="text-text-light">{totalPages}</span>
      </span>

      {/* Prev / Next controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-panel-secondary border border-card-border rounded-md text-text-light font-mono text-xs hover:border-border-gold transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>PREV</span>
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 bg-panel-secondary border border-card-border rounded-md text-text-light font-mono text-xs hover:border-border-gold transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>NEXT</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
