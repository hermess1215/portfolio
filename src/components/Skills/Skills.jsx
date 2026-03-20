import { SiReact, SiJavascript, SiHtml5, SiGit, SiGithub } from 'react-icons/si'
import { FiLayout, FiCode } from 'react-icons/fi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Skills.module.css'

const SKILLS = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', icon: <SiReact />, stars: 4 },
      { name: 'Next.js', icon: <FiCode />, stars: 2 },
      { name: 'JavaScript', icon: <SiJavascript />, stars: 4 },
      { name: 'HTML', icon: <SiHtml5 />, stars: 4 },
      { name: 'CSS', icon: <FiLayout />, stars: 4 },
    ],
  },
  {
    category: '협업 · 기타',
    items: [
      { name: 'Git', icon: <SiGit />, stars: 4 },
      { name: 'GitHub', icon: <SiGithub />, stars: 4 },
    ],
  },
]

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`숙련도 ${count}점 / 5점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function Skills() {
  const ref = useScrollReveal()

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <p className="section-label reveal">Tech Stack</p>
        <h2 className="section-title reveal reveal-delay-1">기술 스택</h2>
        <div className="section-divider reveal reveal-delay-1" />

        <div className={styles.grid}>
          {SKILLS.map((group, gi) => (
            <div key={group.category} className={`${styles.card} reveal reveal-delay-${gi % 4 + 1}`}>
              <h3 className={styles.category}>{group.category}</h3>
              <ul className={styles.list}>
                {group.items.map(({ name, icon, stars }) => (
                  <li key={name} className={styles.item}>
                    <span className={styles.icon}>{icon}</span>
                    <span className={styles.name}>{name}</span>
                    <Stars count={stars} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
