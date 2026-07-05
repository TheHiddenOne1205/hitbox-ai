"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Loader2, Zap, SkipForward, X } from "lucide-react";

type Props = {
  onExtract?: (file: File) => void;
  onSkip?: () => void;
  isExtracting?: boolean;
};

export function DraftUpload({ onExtract, onSkip, isExtracting = false }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type === "application/pdf" || file.type === "text/plain" || file.type === "text/markdown")) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleExtract = () => {
    if (selectedFile && onExtract) {
      onExtract(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">
          Step 0 — Optional
        </span>
        <h2 className="font-sans text-base font-semibold text-text-light">
          Import from Draft Blueprint
        </h2>
        <p className="text-sm text-text-muted">
          Upload an existing design document and Gemini will auto-populate your project form fields from its contents.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-all duration-200 cursor-pointer select-none ${
          isDragging
            ? "border-border-gold bg-panel-active/60"
            : selectedFile
            ? "border-pixel-green/50 bg-pixel-green/5 cursor-default"
            : "border-card-border hover:border-border-gold bg-panel-secondary/40 hover:bg-panel-secondary/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={handleFileSelect}
        />

        {selectedFile ? (
          <>
            <div className="w-12 h-12 rounded-lg bg-pixel-green/10 border border-pixel-green/30 flex items-center justify-center">
              <FileText className="w-6 h-6 text-pixel-green" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-sans text-sm font-semibold text-text-light">{selectedFile.name}</span>
              <span className="font-mono text-xs text-text-muted">
                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to extract
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-pixel-red hover:bg-pixel-red/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div
              className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                isDragging
                  ? "bg-border-gold/10 border-border-gold text-accent-gold"
                  : "bg-panel-secondary border-card-border text-text-muted"
              }`}
            >
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-sans text-sm font-semibold text-text-light">
                {isDragging ? "Drop your file here" : "Click to upload or drag and drop"}
              </span>
              <span className="font-mono text-xs text-text-muted">PDF, TXT, or Markdown — max 10MB</span>
            </div>
          </>
        )}
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleExtract}
          disabled={!selectedFile || isExtracting}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          {isExtracting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isExtracting ? "Extracting..." : "Extract from Draft"}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-2 px-4 py-2.5 bg-panel-secondary border border-card-border text-text-muted font-sans text-sm rounded-md hover:border-border-gold hover:text-text-light transition-all"
        >
          <SkipForward className="w-4 h-4" />
          Skip — Fill Manually
        </button>
      </div>
    </div>
  );
}
