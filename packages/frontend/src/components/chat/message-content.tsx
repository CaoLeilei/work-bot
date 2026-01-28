"use client"

import { FileUpload } from "./file-upload"
import { ImageDisplay } from "./image-display"
import { CodeBlock } from "./code-block"
import { TableDisplay } from "./table-display"
import { JsonDisplay } from "./json-display"
import { MessageContent } from "@/types/message"

interface MessageContentRendererProps {
  content: MessageContent
  onFileUpload?: (files: File[]) => void
}

export function MessageContentRenderer({
  content,
  onFileUpload,
}: MessageContentRendererProps) {
  switch (content.type) {
    case "text":
      return (
        <p className="whitespace-pre-wrap">{content.data as string}</p>
      )

    case "image":
      return <ImageDisplay data={content.data as any} />

    case "file-upload":
      return (
        <FileUpload
          data={content.data as any}
          onUpload={onFileUpload || (() => {})}
        />
      )

    case "code":
      return <CodeBlock data={content.data as any} />

    case "table":
      return <TableDisplay data={content.data as any} />

    case "json":
      return <JsonDisplay data={content.data as any} />

    default:
      return <p className="text-muted-foreground">未知内容类型</p>
  }
}
