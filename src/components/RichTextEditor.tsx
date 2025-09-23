import React, { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { supabase } from '../lib/supabase'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Heading from "@tiptap/extension-heading"
import UnderlineExtension from "@tiptap/extension-underline"
import { Mark } from "@tiptap/core"
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Image as ImageIcon,
  Undo,
  Redo,
  Pilcrow,
  ListOrdered,
  Quote,
  Heading1,
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [debug, setDebug] = useState<string>('')

  const FontSize = Mark.create({
  name: "fontSize",

    addAttributes() {
      return {
        size: {
          default: "16px",
          parseHTML: element => element.style.fontSize,
          renderHTML: attributes => {
            return { style: `font-size: ${attributes.size}` }
          },
        },
      }
    },

    parseHTML() {
      return [{ style: "font-size" }]
    },

    renderHTML({ HTMLAttributes }) {
      return ["span", HTMLAttributes, 0]
    },

    addCommands() {
      return {
        setFontSize:
          (size: string) =>
          ({ commands }) => {
            return commands.setMark(this.name, { size })
          },
        unsetFontSize:
          () =>
          ({ commands }) => {
            return commands.unsetMark(this.name)
          },
      }
    },
  })


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      UnderlineExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    try {
      const fileName = `${Date.now()}-${file.name}`
      setDebug(`Uploading ${fileName}...`)

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('DevotionalImages')
        .upload(fileName, file)

      if (uploadError) {
        setDebug(`❌ Upload failed: ${uploadError.message}`)
        return
      }

      // Get public URL
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('DevotionalImages')
        .getPublicUrl(fileName)

      if (urlError) {
        setDebug(`❌ Failed to get URL: ${urlError.message}`)
        return
      }

      const publicUrl = publicUrlData?.publicUrl
      if (publicUrl) {
        editor.chain().focus().setImage({ src: publicUrl }).run()
        setDebug('✅ Image inserted successfully!')
      }
    } catch (err) {
      setDebug(`Unexpected error: ${String(err)}`)
    } finally {
      e.target.value = '' // reset so same file can be picked again
    }
  }

  const setFontSize = (size: string) => {
    if (editor) {
      editor.chain().focus().setFontSize(size).run()
    }
  }

  const setColor = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run()
    }
  }

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 overflow-x-auto">
        <div className="flex flex-nowrap gap-2 min-w-max">
          {/* Bold / Italic / Underline */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
              title="Bold"
            >
              <Bold className="h-4 w-4 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
              title="Italic"
            >
              <Italic className="h-4 w-4 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('underline') ? 'bg-gray-200' : ''
              }`}
              title="Underline"
            >
              <Underline className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Ordered List */}
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4 text-gray-700" />
          </button>

          {/* Heading */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4 text-gray-700" />
          </button>
          
          {/* Line Break Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="p-2 rounded hover:bg-gray-100"
              title="Line Break"
            >
              ⏎
            </button>
            
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="Quote"
          >
            <Quote className="h-4 w-4 text-gray-700" />
          </button>



          {/* Paragraph */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('paragraph') ? 'bg-gray-200' : ''
            }`}
            title="Paragraph"
          >
            <Pilcrow className="h-4 w-4 text-gray-700" />
          </button>

          {/* Font Size */}
          <select
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 bg-white"
          >
            <option value="">Size</option>
            <option value="12px">Small</option>
            <option value="16px">Normal</option>
            <option value="20px">Large</option>
            <option value="24px">X-Large</option>
          </select>

          {/* Color Picker */}
          <div className="flex items-center space-x-1">
            <Palette className="h-4 w-4 text-gray-600" />
            <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Text Color"
            />
          </div>

          {/* Insert Image */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleImageClick}
              className="p-2 rounded hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4 text-gray-700" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="h-4 w-4 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Debug Message */}
        {debug && <p className="text-xs text-yellow-500 mt-2">{debug}</p>}
      </div>

      {/* Editor */}
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
        <EditorContent
          editor={editor}
          placeholder={placeholder}
          className="text-gray-800 bg-white p-4 rounded"
        />
      </div>
    </div>
  )
}
