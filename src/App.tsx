import { useState, useEffect, useCallback } from 'react'
import { games } from './types/game'
import { launchGame, cleanupEmulator } from './utils/nostalgist'
import {
  saveGameToStorage,
  loadGameFromStorage,
  loadGameFromPath,
} from './utils/storage'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nostalgistInstance, setNostalgistInstance] = useState<unknown>(null)

  const handleBackToGameList = useCallback(() => {
    if (nostalgistInstance) {
      cleanupEmulator(nostalgistInstance)
      setNostalgistInstance(null)
    }
    setIsPlaying(false)
    setLoading(false)
    window.scrollTo(0, 0)
  }, [nostalgistInstance])

  // Handle ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlaying) {
        handleBackToGameList()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, handleBackToGameList])

  const handleGameClick = async (game: (typeof games)[0]) => {
    setLoading(true)
    setIsPlaying(true)

    try {
      // 1. Try to load from file path if available
      if (game.filePath) {
        try {
          const instance = await launchGame(game.filePath)
          setNostalgistInstance(instance)
          setTimeout(() => {
            setLoading(false)
          }, 1000)
          return
        } catch (e) {
          console.log('Không load được từ URL, thử load từ file object:', e)
          const fileFromPath = await loadGameFromPath(game.filePath)
          if (fileFromPath) {
            await saveGameToStorage(game.name, fileFromPath)
            const instance = await launchGame(fileFromPath)
            setNostalgistInstance(instance)
            setTimeout(() => {
              setLoading(false)
            }, 1000)
            return
          }
        }
      }

      // 2. Try to load from IndexedDB (if previously selected)
      try {
        const savedFile = await loadGameFromStorage(game.name)
        if (savedFile) {
          const fileUrl = URL.createObjectURL(savedFile)
          try {
            const instance = await launchGame(fileUrl)
            setNostalgistInstance(instance)
            setTimeout(() => {
              setLoading(false)
            }, 1000)
            return
          } catch {
            const instance = await launchGame(savedFile)
            setNostalgistInstance(instance)
            setTimeout(() => {
              setLoading(false)
            }, 1000)
            return
          }
        }
      } catch {
        console.log('Không tìm thấy game đã lưu')
      }

      // 3. Open file picker to select file
      await loadGameFromFilePicker(game.name)
    } catch (error) {
      console.error('Lỗi khi load game:', error)
      alert('Có lỗi xảy ra khi load game. Vui lòng thử lại.')
      setLoading(false)
      setIsPlaying(false)
    }
  }

  const loadGameFromFilePicker = async (gameName: string) => {
    if (!('showOpenFilePicker' in window)) {
      alert(
        'Trình duyệt của bạn không hỗ trợ chọn file. Vui lòng dùng Chrome hoặc Edge.',
      )
      setLoading(false)
      setIsPlaying(false)
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileHandle = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'NES ROM files',
            accept: { 'application/octet-stream': ['.nes'] },
          },
        ],
      })
      const file = await fileHandle[0].getFile()

      // Save to IndexedDB for faster loading next time
      await saveGameToStorage(gameName, file)

      // Launch game
      const instance = await launchGame(file)
      setNostalgistInstance(instance)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      // User cancelled file picker
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Lỗi khi chọn file:', error)
        alert('Có lỗi xảy ra khi chọn file. Vui lòng thử lại.')
      }
      setLoading(false)
      setIsPlaying(false)
    }
  }

  return (
    <>
      {isPlaying && (
        <button
          className="back-button"
          onClick={handleBackToGameList}
          title="Nhấn ESC để quay lại"
        >
          ← Quay lại danh sách
        </button>
      )}

      <div className="container">
        <h1>🎮 NES Game Collection</h1>
        {!isPlaying && (
          <div className="game-list">
            {games.map((game) => (
              <div
                key={game.name}
                className="game-item"
                onClick={() => handleGameClick(game)}
              >
                <div className="game-name">{game.name}</div>
                <div className="game-description">{game.description}</div>
              </div>
            ))}
          </div>
        )}
        {loading && <div className="loading">Đang tải game...</div>}
      </div>
    </>
  )
}

export default App
