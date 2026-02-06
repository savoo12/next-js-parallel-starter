export default function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://docs.parallel.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Documentation
          </a>
          <span className="text-border">|</span>
          <a
            href="https://vercel.com/marketplace/parallel"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            API Key
          </a>
          <span className="text-border">|</span>
          <a
            href="https://github.com/parallel-web/parallel-cookbook/tree/main/typescript-recipes/parallel-vercel-template"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Next.js
          </a>{" "}
          and{" "}
          <a
            href="https://www.npmjs.com/package/parallel-web"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Parallel
          </a>
        </p>
      </div>
    </footer>
  );
}
