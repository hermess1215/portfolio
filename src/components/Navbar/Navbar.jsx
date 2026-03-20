import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`}>
        <a href="#hero" className={styles.logo}>
          <span className={styles.logoCode}>&lt;</span>
          JH
          <span className={styles.logoCode}> /&gt;</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className={styles.link} onClick={closeMenu}>
                {label}
              </a>
            </li>
          ))}
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
