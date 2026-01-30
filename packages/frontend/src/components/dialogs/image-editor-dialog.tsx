'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Download, Crop, Type, RefreshCw, Undo, Redo, Save } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TextLayer {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  rotation: number
}

export function ImageEditorDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [scale, setScale] = useState([1])
  const [rotation, setRotation] = useState([0])
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [texts, setTexts] = useState<TextLayer[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<'select' | 'text'>('select')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (image && canvasRef.current) {
      drawImage()
    }
  }, [image, scale, rotation, brightness, contrast, saturation, texts])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation[0] * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.restore()

      // Draw text layers
      texts.forEach((text) => {
        ctx.save()
        ctx.translate(text.x, text.y)
        ctx.rotate((text.rotation * Math.PI) / 180)
        ctx.font = `${text.fontSize}px Arial`
        ctx.fillStyle = text.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text.text, 0, 0)
        ctx.restore()
      })
    }
    img.src = image
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        saveToHistory(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveToHistory = (imgData: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imgData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setImage(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setImage(history[historyIndex + 1])
    }
  }

  const handleAddText = () => {
    const newText: TextLayer = {
      id: Math.random().toString(36).substr(2, 9),
      text: '双击编辑文字',
      x: 200,
      y: 200,
      fontSize: 32,
      color: '#000000',
      rotation: 0,
    }
    setTexts([...texts, newText])
    setSelectedTextId(newText.id)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `edited-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'select') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    const clickedText = texts.find((text) => {
      const dx = x - text.x
      const dy = y - text.y
      return Math.sqrt(dx * dx + dy * dy) < text.fontSize
    })

    setSelectedTextId(clickedText?.id || null)
  }

  const defaultTrigger = (
    <Button variant="default" className="w-full">
      打开工具
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="!max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>图片编辑</DialogTitle>
          <DialogDescription>裁切、调整、添加文字，一键编辑图片</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* 左侧工具栏 */}
          <div className="w-64 space-y-4 overflow-y-auto">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">工具</h3>
              <div className="space-y-2">
                <Button
                  variant={activeTool === 'select' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTool('select')}>
                  <Type className="h-4 w-4 mr-2" />
                  选择工具
                </Button>
                <Button
                  variant={activeTool === 'text' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTool('text')}>
                  <Type className="h-4 w-4 mr-2" />
                  文字工具
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">调整</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>缩放</Label>
                    <span className="text-muted-foreground">{Math.round(scale[0] * 100)}%</span>
                  </div>
                  <Slider value={scale} onValueChange={setScale} min={50} max={200} step={5} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>旋转</Label>
                    <span className="text-muted-foreground">{rotation[0]}°</span>
                  </div>
                  <Slider value={rotation} onValueChange={setRotation} min={-180} max={180} step={1} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">色彩调整</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>亮度</Label>
                    <span className="text-muted-foreground">{brightness[0]}%</span>
                  </div>
                  <Slider value={brightness} onValueChange={setBrightness} min={0} max={200} step={5} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>对比度</Label>
                    <span className="text-muted-foreground">{contrast[0]}%</span>
                  </div>
                  <Slider value={contrast} onValueChange={setContrast} min={0} max={200} step={5} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>饱和度</Label>
                    <span className="text-muted-foreground">{saturation[0]}%</span>
                  </div>
                  <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} step={5} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">文字设置</h3>
              {selectedTextId && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">文字内容</Label>
                    <Input
                      value={texts.find((t) => t.id === selectedTextId)?.text || ''}
                      onChange={(e) => {
                        setTexts(texts.map((t) => (t.id === selectedTextId ? { ...t, text: e.target.value } : t)))
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <Label>字号</Label>
                      <span className="text-muted-foreground">
                        {texts.find((t) => t.id === selectedTextId)?.fontSize || 32}px
                      </span>
                    </div>
                    <Slider
                      value={[texts.find((t) => t.id === selectedTextId)?.fontSize || 32]}
                      onChange={([v]) => {
                        setTexts(texts.map((t) => (t.id === selectedTextId ? { ...t, fontSize: v } : t)))
                      }}
                      min={12}
                      max={120}
                      step={2}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">文字颜色</Label>
                    <Input
                      type="color"
                      value={texts.find((t) => t.id === selectedTextId)?.color || '#000000'}
                      onChange={(e) => {
                        setTexts(texts.map((t) => (t.id === selectedTextId ? { ...t, color: e.target.value } : t)))
                      }}
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* 中间画布区域 */}
          <div className="flex-1 bg-muted/30 rounded-lg overflow-auto flex items-center justify-center">
            {image ? (
              <div className="relative inline-block">
                <canvas ref={canvasRef} onClick={handleCanvasClick} className="max-w-full cursor-crosshair" />
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">上传图片开始编辑</p>
                <Button onClick={() => fileInputRef.current?.click()}>选择图片</Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 右侧操作栏 */}
          <div className="w-16 space-y-2">
            <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} title="撤销">
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="重做">
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleAddText} title="添加文字">
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setScale([1])
                setRotation([0])
                setBrightness([100])
                setContrast([100])
                setSaturation([100])
              }}
              title="重置">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 底部操作栏 */}
        {image && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              更换图片
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              保存图片
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
