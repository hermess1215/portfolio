import { useState } from 'react'
import { FiGithub, FiMail, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Contact.module.css'

const CONTACT_ITEMS = [
  {
    icon: <FiMail />,
    label: '이메일',
    value: 'kimjaehwi1212@gmail.com',
    href: 'mailto:your.email@example.com',
  },
  {
    icon: <FiGithub />,
    label: 'GitHub',
    value: 'github.com/hermess1215',
    href: 'https://github.com/hermess1215',
  },
]

export default function Contact() {
  const ref = useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // EmailJS 연동 위치
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className={`section ${styles.contact}`} ref={ref}>
      <div className="container">
        <p className="section-label reveal">Get In Touch</p>
        <h2 className="section-title reveal reveal-delay-1">연락하기</h2>
        <div className="section-divider reveal reveal-delay-1" />

        <p className={`${styles.intro} reveal reveal-delay-2`}>
          프로젝트 협업 제안, 채용 문의, 또는 그냥 인사라도 언제든지 환영합니다!
        </p>

        <div className={styles.grid}>
          {/* 연락처 정보 */}
          <div className={`${styles.infoCol} reveal reveal-delay-2`}>
            <h3 className={styles.colTitle}>연락처</h3>
            <ul className={styles.contactList}>
              {CONTACT_ITEMS.map(({ icon, label, value, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <span className={styles.contactIcon}>{icon}</span>
                    <div>
                      <p className={styles.contactLabel}>{label}</p>
                      <p className={styles.contactValue}>{value}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className={styles.openToWork}>
              <span className={styles.openDot} />
              현재 협업 · 인턴십 기회를 찾고 있습니다.
            </div>
          </div>

          {/* 연락 폼 */}
          <div className={`${styles.formCol} reveal reveal-delay-3`}>
            <h3 className={styles.colTitle}>메시지 보내기</h3>
            {sent ? (
              <div className={styles.successMsg}>
                <FiSend />
                메시지가 전송되었습니다! 빠르게 답변드릴게요
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    <FiUser /> 이름
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    placeholder="홍길동"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    <FiMail /> 이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    placeholder="hong@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>
                    <FiMessageSquare /> 메시지
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="안녕하세요! 협업 제안 드리고 싶어서 연락드립니다..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                  <FiSend /> 메시지 보내기
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
