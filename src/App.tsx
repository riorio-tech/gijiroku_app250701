import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

interface Note {
  id: number;
  text: string;
  createdAt: string;
}

interface MeetingVideo {
  id: number;
  name: string;
  file: File;
  url: string;
  createdAt: string;
  duration?: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [videos, setVideos] = useState<MeetingVideo[]>([])
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<'notes' | 'videos'>('notes')

  const handleAdd = () => {
    if (!input.trim()) return
    setNotes([
      { id: Date.now(), text: input, createdAt: new Date().toLocaleString() },
      ...notes,
    ])
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  }

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleDeleteVideo = (id: number) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      URL.revokeObjectURL(video.url);
    }
    setVideos(videos.filter((video) => video.id !== id));
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newVideos = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file: file,
      url: URL.createObjectURL(file),
      createdAt: new Date().toLocaleString(),
      duration: '00:00' // 実際の実装では動画の長さを取得
    }));
    
    setVideos(prev => [...newVideos, ...prev]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    multiple: true
  });

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 議事録アプリ</h1>
          <p className="subtitle">会議の内容を簡単に記録・管理</p>
        </header>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 議事録
          </button>
          <button 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            🎥 録画MTG ({videos.length})
          </button>
        </div>
        
        {activeTab === 'notes' && (
          <>
            <div className="input-section">
              <div className="input-area">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="議事内容を入力してください...&#10;Enterキーで追加、Shift+Enterで改行"
                  rows={6}
                  className="note-textarea"
                />
                <div className="button-group">
                  <button onClick={handleAdd} className="add-btn">
                    <span className="btn-icon">+</span>
                    追加
                  </button>
                  <button 
                    onClick={() => setInput('')} 
                    className="clear-btn"
                    disabled={!input.trim()}
                  >
                    クリア
                  </button>
                </div>
              </div>
            </div>

            <div className="notes-section">
              <h2 className="section-title">
                議事録一覧 ({notes.length})
              </h2>
              <div className="notes-list">
                {notes.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>まだ議事録がありません</p>
                    <p className="empty-hint">上記のテキストエリアに内容を入力して追加してください</p>
                  </div>
                )}
                {notes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-date">
                        <span className="date-icon">🕒</span>
                        {note.createdAt}
                      </span>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(note.id)}
                        title="削除"
                      >
                        <span className="delete-icon">×</span>
                      </button>
                    </div>
                    <div className="note-text">{note.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'videos' && (
          <div className="videos-section">
            <div className="upload-section">
              <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="upload-content">
                  <div className="upload-icon">📁</div>
                  {isDragActive ? (
                    <p>ファイルをここにドロップしてください...</p>
                  ) : (
                    <>
                      <p>録画したMTGファイルをドラッグ&ドロップ</p>
                      <p className="upload-hint">またはクリックしてファイルを選択</p>
                      <p className="file-types">対応形式: MP4, AVI, MOV, MKV, WebM</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="videos-list">
              <h2 className="section-title">
                保存された録画 ({videos.length})
              </h2>
              {videos.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🎥</div>
                  <p>まだ録画ファイルがありません</p>
                  <p className="empty-hint">上記のエリアに動画ファイルをドラッグ&ドロップしてください</p>
                </div>
              )}
              {videos.map((video) => (
                <div key={video.id} className="video-item">
                  <div className="video-header">
                    <div className="video-info">
                      <span className="video-name">{video.name}</span>
                      <span className="video-date">
                        <span className="date-icon">🕒</span>
                        {video.createdAt}
                      </span>
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteVideo(video.id)}
                      title="削除"
                    >
                      <span className="delete-icon">×</span>
                    </button>
                  </div>
                  <div className="video-player">
                    <video 
                      controls 
                      className="video-element"
                      src={video.url}
                    >
                      お使いのブラウザは動画再生をサポートしていません。
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
