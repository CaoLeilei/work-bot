export type ContentType =
  | "text"
  | "image"
  | "file-upload"
  | "code"
  | "table"
  | "json"

export interface FileUploadData {
  accept?: string
  maxSize?: number
  multiple?: boolean
  description?: string
}

export interface ImageData {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface CodeData {
  code: string
  language?: string
  filename?: string
}

export interface TableData {
  headers: string[]
  rows: (string | number)[][]
}

export interface MessageContent {
  type: ContentType
  data: string | FileUploadData | ImageData | CodeData | TableData | any
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: MessageContent | MessageContent[]
}
