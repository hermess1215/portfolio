import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isBoard = pathname === '/board'
  const isStudy = pathname === '/study'

  const { user, signIn, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const openLogin = () => {
    setShowLoginModal(true)
    closeMenu()
  }

  const closeLogin = () => {
    setShowLoginModal(false)
    setLoginForm({ email: '', password: '' })
    setLoginError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const err = await signIn(loginForm.email, loginForm.password)
    if (err) {
      setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      closeLogin()
    }
    setLoginLoading(false)
  }

  return (
    <>
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
                className={`${styles.link} ${isBoard ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                Board
              </Link>
            </li>
            <li>
              <Link
                to="/study"
                className={`${styles.link} ${isStudy ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                Study
              </Link>
            </li>
            {/* 모바일 메뉴 안에도 로그인/로그아웃 */}
            <li className={styles.mobileAuthItem}>
              {user ? (
                <button className={styles.logoutBtnMobile} onClick={() => { signOut(); closeMenu() }}>
                  <FiLogOut /> 로그아웃
                </button>
              ) : (
                <button className={styles.loginBtnMobile} onClick={openLogin}>
                  <FiLogIn /> 로그인
                </button>
              )}
            </li>
          </ul>

          <div className={styles.actions}>
            {user ? (
              <button className={styles.authBtn} onClick={signOut} title={user.email} aria-label="로그아웃">
                <FiUser />
                <span className={styles.authBtnLabel}>로그아웃</span>
              </button>
            ) : (
              <button className={styles.authBtn} onClick={openLogin} aria-label="로그인">
                <FiLogIn />
                <span className={styles.authBtnLabel}>로그인</span>
              </button>
            )}
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

      {showLoginModal && (
        <div className={styles.overlay} onClick={closeLogin}>
          <div className={styles.loginModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>로그인</h3>
              <button className={styles.closeBtn} onClick={closeLogin}><FiX /></button>
            </div>
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="이메일"
                value={loginForm.email}
                onChange={e => { setLoginForm(f => ({ ...f, email: e.target.value })); setLoginError('') }}
                className={styles.loginInput}
                autoFocus
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={loginForm.password}
                onChange={e => { setLoginForm(f => ({ ...f, password: e.target.value })); setLoginError('') }}
                className={styles.loginInput}
                required
              />
              {loginError && <p className={styles.loginError}>{loginError}</p>}
              <button type="submit" className={styles.loginSubmitBtn} disabled={loginLoading}>
                {loginLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
