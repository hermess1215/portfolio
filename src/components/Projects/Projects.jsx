import { useState } from 'react'
import { FiGithub, FiExternalLink, FiUsers, FiUser } from 'react-icons/fi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Projects.module.css'

const PROJECTS = [
  {
    id: 1,
    title: '스터디 모집 & 관리 플랫폼',
    description:
      '스터디 그룹을 모집하고 일정 · 공지 · 멤버를 통합 관리하는 웹 앱. 팀원들과 함께 React와 Next.js를 활용해 개발 중입니다.',
    tags: ['React', 'Next.js', 'JavaScript'],
    type: 'team',
    period: '2025.03 ~ 진행 중',
    github: 'https://github.com',
    demo: null,
    status: '진행 중',
  },
  {
    id: 2,
    title: 'CodeCraft 동아리 프로젝트',
    description:
      'CodeCraft 프로그래밍 동아리 내 팀 기반 개발 프로젝트. 기획부터 배포까지 협업 프로세스 전반을 경험했습니다.',
    tags: ['React', 'JavaScript', 'Git', 'GitHub'],
    type: 'team',
    period: '2025.01 ~',
    github: 'https://github.com',
    demo: null,
    status: '진행 중',
  },
  {
    id: 3,
    title: '알고리즘 풀이 아카이브',
    description:
      '백준, 프로그래머스 등에서 풀이한 알고리즘 문제들을 카테고리별로 정리하고 풀이 과정을 기록하는 개인 레포지토리입니다.',
    tags: ['Python', 'Java', '알고리즘', 'GitHub'],
    type: 'personal',
    period: '2024.09 ~',
    github: 'https://github.com',
    demo: null,
    status: '진행 중',
  },
]

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '팀 프로젝트', value: 'team' },
  { label: '개인 프로젝트', value: 'personal' },
]

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const ref = useScrollReveal()

  const filtered = PROJECTS.filter(p => filter === 'all' || p.type === filter)

  return (
    <section id="projects" className={`section ${styles.projects}`} ref={ref}>
      <div className="container">
        <p className="section-label reveal">Portfolio</p>
        <h2 className="section-title reveal reveal-delay-1">프로젝트</h2>
        <div className="section-divider reveal reveal-delay-1" />

        {/* 필터 */}
        <div className={`${styles.filters} reveal reveal-delay-2`}>
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              className={`${styles.filterBtn} ${filter === value ? styles.active : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 카드 그리드 */}
        <div className={styles.grid}>
          {filtered.map((project, i) => (
            <article
              key={project.id}
              className={`${styles.card} reveal reveal-delay-${(i % 3) + 1}`}
            >
              {/* 상단 */}
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.typeChip}>
                    {project.type === 'team' ? <FiUsers /> : <FiUser />}
                    {project.type === 'team' ? '팀' : '개인'}
                  </span>
                  <span className={`${styles.statusBadge} ${project.status === '완료' ? styles.done : styles.wip}`}>
                    {project.status}
                  </span>
                </div>
                <div className={styles.cardLinks}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <FiGithub />
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="배포 링크">
                      <FiExternalLink />
                    </a>
                  )}
                </div>
              </div>

              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardPeriod}>{project.period}</p>
              <p className={styles.cardDesc}>{project.description}</p>

              <div className={styles.tags}>
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
