import { useState, useEffect } from 'react'
import { FiArrowDown, FiGithub, FiMail } from 'react-icons/fi'
import styles from './Hero.module.css'

const TYPING_TEXTS = [
  'Frontend 개발자',
  'React 개발자',
  '웹 개발자',
]

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const current = TYPING_TEXTS[textIndex]
    let timeout

    if (!isDeleting && charIndex <= current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex))
        setCharIndex(i => i + 1)
      }, 80)
    } else if (!isDeleting && charIndex > current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(i => i - 1)
      }, 40)
    } else {
      setIsDeleting(false)
      setTextIndex(i => (i + 1) % TYPING_TEXTS.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex])

  return (
    <section id="hero" className={styles.hero}>
      {/* 배경 그라디언트 오브 */}
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />

      <div className={`container ${styles.content}`}>
        <p className={styles.greeting}>안녕하세요, 저는</p>

        <h1 className={styles.name}>김재휘</h1>

        <div className={styles.typingWrapper}>
          <span className={styles.typingText}>{displayed}</span>
          <span className={styles.cursor} aria-hidden>|</span>
          <span className={styles.typingSuffix}>&nbsp;입니다.</span>
        </div>

        <p className={styles.sub}>
          React · JavaScript로 사용자 친화적인 서비스를 만듭니다.
        </p>

        <div className={styles.cta}>
          <a href="#projects" className="btn btn-primary">
            프로젝트 보기
          </a>
          <a href="#contact" className="btn btn-outline">
            <FiMail />
            연락하기
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconBtn}
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
        </div>
      </div>

      <a href="#about" className={styles.scrollDown} aria-label="아래로 스크롤">
        <FiArrowDown />
      </a>
    </section>
  )
}
