import MarkdownIt from "markdown-it";
import "github-markdown-css";

const md = new MarkdownIt({
  html: false,
  breaks: true,
  typographer: true,
});

export function renderMarkdown(content: string) {
  return md.render(content);
}

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
