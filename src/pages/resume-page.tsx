import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { latex } from "codemirror-lang-latex";
import { Heading, Subheading } from "../components/catalyst/heading";
import { Text } from "../components/catalyst/text";
import { Button } from "../components/catalyst/button";
import { ArrowDownTrayIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

const DEFAULT_LATEX = String.raw`
\documentclass{article}
\usepackage{graphicx} % Required for inserting images

\title{Document}
\author{John Doe}

\begin{document}

\maketitle

\section{Introduction}

\end{document}

`.trim();

const editorExtensions = [
  latex({
    autoCloseTags: true,
    enableLinting: true,
    enableTooltips: true,
    enableAutocomplete: true,
    autoCloseBrackets: true,
  }),
];

export default function ResumePage() {
  const [source, setSource] = useState<string>(DEFAULT_LATEX);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  async function compile(options?: { download?: boolean }) {
    const download = options?.download ?? false;
    setCompiling(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source }),
      });

      if (!response.ok) {
        const message = await response
          .text()
          .catch(() => "Erreur lors de la compilation.");
        throw new Error(message || `Erreur serveur (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setPdfUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return url;
      });

      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = "cv.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de compiler le document.";
      setError(message);
    } finally {
      setCompiling(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Heading level={1}>LaTeX Resume Editor</Heading>
          <Text>
            Create your resume using LaTeX and compile it to PDF.
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            outline
            onClick={() => compile({ download: false })}
            data-disabled={compiling ? "true" : undefined}
          >
            <span data-slot="icon">
              <PlayCircleIcon />
            </span>
            {compiling ? "Compiling..." : "Update preview"}
          </Button>
          <Button
            outline
            onClick={() => compile({ download: true })}
            data-disabled={compiling ? "true" : undefined}
          >
            <span data-slot="icon">
              <ArrowDownTrayIcon />
            </span>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Subheading level={2}>LaTeX Source</Subheading>
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CodeMirror
              value={source}
              height="500px"
              theme={vscodeLight}
              extensions={editorExtensions}
              onChange={(value) => setSource(value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Subheading level={2}>PDF Preview</Subheading>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {pdfUrl ? (
              <iframe
                key={pdfUrl}
                src={pdfUrl}
                className="h-[480px] w-full rounded-md border-none"
                title="Aperçu du CV"
              />
            ) : (
              <Text className="text-center text-sm">
                Compile document to show PDF preview here.
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
