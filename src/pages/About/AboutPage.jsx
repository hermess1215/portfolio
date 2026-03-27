import { useState, useEffect } from 'react'
import Skills from '../../components/Skills/Skills'
import Projects from '../../components/Projects/Projects'
import Experience from '../../components/Experience/Experience'
import Contact from '../../components/Contact/Contact'
import styles from './AboutPage.module.css'

const SUB_NAV = [
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
]

export default function AboutPage() {
  const [active, setActive] = useState('skills')

  useEffect(() => {
    const sections = SUB_NAV.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <div className={styles.subNavWrap}>
        <ul className={styles.subNavList}>
          {SUB_NAV.map(({ label, id }) => (
            <li key={id}>
              <button
                className={`${styles.subNavBtn} ${active === id ? styles.active : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
                {active === id && <span className={styles.dot} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  )
}
