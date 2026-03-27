import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import styles from './Navbar.module.css'

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isBoard = pathname === '/board'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoCode}>&lt;</span>
          JH
          <span className={styles.logoCode}> /&gt;</span>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          <li>
            <a href="/#about" className={styles.link} onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <Link
              to="/board"
              className={`${styles.link} ${isBoard ? styles.activeLink : ''} ${styles.boardLink}`}
              onClick={closeMenu}
            >
              게시판
            </Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label="테마 전환"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="메뉴 열기"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  )
}
