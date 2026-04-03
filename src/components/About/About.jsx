import { useScrollReveal } from '../../hooks/useScrollReveal'
import { FiBook, FiCode, FiCpu, FiUsers } from 'react-icons/fi'
import styles from './About.module.css'

const INTERESTS = [
  { icon: <FiUsers />, label: '프론트엔드 개발' },
]

const INFO_ITEMS = [
  { label: '학교', value: '고등학교 재학 중' },
  { label: '소속', value: 'MC 동아리' },
  { label: '관심사', value: 'React, Next.js' },
  { label: '목표', value: '사용자에게 가치를 주는 서비스 개발' },
]

export default function About() {
  const ref = useScrollReveal()

  return (
    <section id="about" className={`section ${styles.about}`} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {/* 프로필 이미지 */}
          <div className={`${styles.imageCol} reveal`}>
            <div className={styles.imageWrapper}>
              <img src="/profile.jpg" alt="김재휘 프로필" className={styles.profileImg} />
              <div className={styles.imageDeco} aria-hidden />
            </div>
          </div>

          {/* 텍스트 */}
          <div className={styles.textCol}>
            <p className={`section-label reveal`}>About Me</p>
            <h2 className={`section-title reveal reveal-delay-1`}>개발이 좋아서, <br />계속 만들고 있습니다.</h2>
            <div className={`section-divider reveal reveal-delay-1`} />

            <p className={`${styles.bio} reveal reveal-delay-2`}>
              안녕하세요! 저는 <strong>김재휘</strong>입니다. 사용자가 실제로 사용하고 싶어지는
              서비스를 만드는 것에 큰 보람을 느끼는 개발자입니다.
            </p>
            <p className={`${styles.bio} reveal reveal-delay-2`}>
              React를 중심으로 프론트엔드 개발에 집중하고 있으며,
              MC 동아리 활동을 통해 팀 프로젝트 경험을 쌓고 있습니다.
            </p>

            <ul className={`${styles.infoList} reveal reveal-delay-3`}>
              {INFO_ITEMS.map(({ label, value }) => (
                <li key={label} className={styles.infoItem}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{value}</span>
                </li>
              ))}
            </ul>

            <div className={`${styles.interests} reveal reveal-delay-4`}>
              {INTERESTS.map(({ icon, label }) => (
                <span key={label} className={styles.interestChip}>
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
