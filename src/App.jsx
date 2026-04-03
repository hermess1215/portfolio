import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Contact from './components/Contact/Contact'
import Board from './pages/Board/Board'
import StudyPage from './pages/Study/StudyPage'
import styles from './App.module.css'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(d => !d)

  return (
    <div className={styles.app}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<main><Hero /><About /><Skills /><Projects /><Experience /><Contact /></main>} />
          <Route path="/board" element={<Board />} />
          <Route path="/study" element={<StudyPage />} />
        </Routes>
      </div>
      <footer className={styles.footer}>
        <div className="container">
          <p>© 2025 김재휘. Crafted with React</p>
        </div>
      </footer>
    </div>
  )
}

export default App
