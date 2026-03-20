import { useScrollReveal } from '../../hooks/useScrollReveal'
import { FiCode, FiAward, FiBook, FiZap } from 'react-icons/fi'
import styles from './Experience.module.css'

const EXPERIENCES = [
  {
    id: 1,
    icon: <FiCode />,
    period: '2025.01 ~ 현재',
    title: 'MC 동아리',
    subtitle: '동아리 활동',
    description:
      '주로 자습을 하며 개발 실력을 키우고, 가끔 수업을 통해 새로운 내용을 배우고 있습니다. 동아리 활동을 통해 꾸준히 성장하고 있습니다.',
    tags: ['자습', '개발', '학습'],
  },
  {
    id: 2,
    icon: <FiZap />,
    period: '2025.02',
    title: 'AI_TOP_100 Campus',
    subtitle: '대외 활동',
    description:
      '다양한 학교 학생들과 교류하며 시야를 넓히고 새로운 자극을 받은 프로그램입니다.',
    tags: ['네트워킹', '대외활동'],
  },
  {
    id: 3,
    icon: <FiBook />,
    period: '2024.03 ~ 현재',
    title: '고등학교 재학',
    subtitle: '학업',
    description:
      '학업과 병행하며 독학으로 프론트엔드 개발을 공부하고 있습니다. CS 기초 지식을 꾸준히 학습 중입니다.',
    tags: ['독학', 'CS 기초', '프론트엔드'],
  },
  {
    id: 4,
    icon: <FiAward />,
    period: '2024 ~',
    title: '개인 프로젝트 & 독학',
    subtitle: '개인 활동',
    description:
      '관심 있는 것들을 직접 만들어보며 실력을 키우고 있습니다. 개인 프로젝트를 통해 React와 JavaScript를 익히고 있습니다.',
    tags: ['React', 'JavaScript', '개인 프로젝트'],
  },
]

export default function Experience() {
  const ref = useScrollReveal()

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <p className="section-label reveal">Journey</p>
        <h2 className="section-title reveal reveal-delay-1">경험</h2>
        <div className="section-divider reveal reveal-delay-1" />

        <div className={styles.timeline}>
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.id}
              className={`${styles.item} reveal reveal-delay-${(i % 3) + 1}`}
            >
              {/* 타임라인 선 */}
              <div className={styles.line}>
                <div className={styles.dot}>
                  <span className={styles.dotIcon}>{exp.icon}</span>
                </div>
                {i < EXPERIENCES.length - 1 && <div className={styles.connector} />}
              </div>

              {/* 콘텐츠 */}
              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <span className={styles.subtitle}>{exp.subtitle}</span>
                    <h3 className={styles.title}>{exp.title}</h3>
                  </div>
                  <time className={styles.period}>{exp.period}</time>
                </div>
                <p className={styles.desc}>{exp.description}</p>
                <div className={styles.tags}>
                  {exp.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
