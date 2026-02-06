export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by Parallel AI
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a
            href="https://docs.parallel.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Docs
          </a>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Next.js
          </a>
        </div>
      </div>
    </footer>
  );
}
