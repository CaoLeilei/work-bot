"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  MoreHorizontal,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AudioFile {
  id: string
  name: string
  url: string
  duration?: number
  artist?: string
  album?: string
}

interface AudioPlayerDialogProps {
  trigger?: React.ReactNode
  files: AudioFile[]
  autoPlay?: boolean
  onEnded?: () => void
}

export function AudioPlayerDialog({
  trigger,
  files = [],
  autoPlay = false,
  onEnded,
}: AudioPlayerDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const currentFile = files[currentIndex] || { name: "无音频", url: "" }

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play()
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      onEnded?.()
      if (repeatMode === "one") {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === "all" && currentIndex < files.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (isShuffle) {
        setCurrentIndex(Math.floor(Math.random() * files.length))
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [repeatMode, isShuffle, currentIndex, files.length])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current || !currentFile.url) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying((prev) => !prev)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else if (repeatMode === "all") {
      setCurrentIndex(files.length - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (repeatMode === "all") {
      setCurrentIndex(0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all"
      if (prev === "all") return "one"
      return "off"
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const defaultTrigger = <Button variant="outline">播放音频</Button>

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <audio
          ref={audioRef}
          src={currentFile.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="space-y-6">
          {/* 文件信息 */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{currentFile.name}</h3>
              {currentFile.artist && (
                <p className="text-sm text-muted-foreground">
                  {currentFile.artist}
                  {currentFile.album && ` - ${currentFile.album}`}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={currentFile.duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentFile.duration || 0)}</span>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffle((prev) => !prev)}
              className={cn(isShuffle && "text-primary")}
            >
              <Shuffle className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0 && repeatMode !== "all"}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              className="h-14 w-14"
              disabled={!currentFile.url}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 ml-1 fill-current" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === files.length - 1 && repeatMode !== "all"}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRepeat}
              className={cn(repeatMode !== "off" && "text-primary")}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="h-5 w-5" />
              ) : (
                <Repeat className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="w-32">
              <Slider
                value={[volume]}
                max={100}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>

          {/* 播放列表 */}
          {files.length > 1 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">播放列表 ({files.length})</div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {files.map((file, index) => (
                  <button
                    key={file.id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      currentIndex === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                    >
                      {currentIndex === index && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      {file.artist && (
                        <p className="text-xs text-muted-foreground truncate">
                          {file.artist}
                        </p>
                      )}
                    </div>
                    {file.duration && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTime(file.duration)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
