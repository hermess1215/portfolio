import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiExternalLink, FiBook, FiCheckCircle, FiLoader, FiPlus, FiEdit2, FiTrash2, FiX, FiLock, FiEye, FiEdit } from 'react-icons/fi'
import supabase from '../../supabase'
import styles from './StudyLog.module.css'

const CATEGORY_COLORS = {
  'Frontend':  'var(--cat-frontend)',
  'Backend':   'var(--cat-backend)',
  'CS':        'var(--cat-cs)',
  'Algorithm': 'var(--cat-algo)',
  'DevOps':    'var(--cat-devops)',
  '기타':      'var(--cat-etc)',
}

const CATEGORIES = ['Frontend', 'Backend', 'CS', 'Algorithm', 'DevOps', '기타']
const EMPTY_FORM = { title: '', category: 'Frontend', memo: '', status: '학습 중', reference_url: '' }

export default function StudyLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [catFilter, setCatFilter] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('전체')

  const [isAdmin, setIsAdmin] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formTab, setFormTab] = useState('write') // 'write' | 'preview'

  const [detailLog, setDetailLog] = useState(null) // 상세 보기

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    const { data, error } = await supabase
      .from('study_logs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('study_logs fetch error:', error)
    setLogs(data ?? [])
    setLoading(false)
  }

  function handlePwSubmit(e) {
    e.preventDefault()
    if (pwInput === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowPwModal(false)
      setPwInput('')
      setPwError('')
    } else {
      setPwError('비밀번호가 틀렸습니다.')
    }
  }

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormTab('write')
    setShowForm(true)
  }

  function openEdit(log, e) {
    e.stopPropagation()
    setEditTarget(log)
    setForm({
      title: log.title,
      category: log.category,
      memo: log.memo ?? '',
      status: log.status,
      reference_url: log.reference_url ?? '',
    })
    setFormTab('write')
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)

    const payload = {
      title: form.title.trim(),
      category: form.category,
      memo: form.memo.trim() || null,
      status: form.status,
      reference_url: form.reference_url.trim() || null,
    }

    if (editTarget) {
      await supabase.from('study_logs').update(payload).eq('id', editTarget.id)
    } else {
      await supabase.from('study_logs').insert(payload)
    }

    await fetchLogs()
    setShowForm(false)
    setSubmitting(false)
  }

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!window.confirm('삭제하시겠습니까?')) return
    await supabase.from('study_logs').delete().eq('id', id)
    setLogs(prev => prev.filter(l => l.id !== id))
    if (detailLog?.id === id) setDetailLog(null)
  }

  const categories = ['전체', ...Array.from(new Set(logs.map(l => l.category)))]
  const filtered = logs.filter(l => {
    const catOk = catFilter === '전체' || l.category === catFilter
    const statusOk = statusFilter === '전체' || l.status === statusFilter
    return catOk && statusOk
  })

  const total      = logs.length
  const done       = logs.filter(l => l.status === '완료').length
  const inProgress = total - done

  return (
    <section id="studylog" className={`section ${styles.section}`}>
      <div className="container">

        {/* 헤더 */}
        <div className={styles.sectionHeader}>
          <div>
            <p className="section-label">Learning</p>
            <h2 className="section-title">공부 기록</h2>
            <div className="section-divider" />
          </div>
          <div className={styles.headerActions}>
            {isAdmin ? (
              <>
                <button className={styles.addBtn} onClick={openAdd}><FiPlus /> 추가</button>
                <button className={styles.adminOffBtn} onClick={() => setIsAdmin(false)}>관리 종료</button>
              </>
            ) : (
              <button className={styles.lockBtn} onClick={() => setShowPwModal(true)}><FiLock /> 관리</button>
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <FiBook className={styles.statIcon} />
            <span className={styles.statNum}>{total}</span>
            <span className={styles.statLabel}>전체</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <FiCheckCircle className={`${styles.statIcon} ${styles.iconDone}`} />
            <span className={styles.statNum}>{done}</span>
            <span className={styles.statLabel}>완료</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <FiLoader className={`${styles.statIcon} ${styles.iconWip}`} />
            <span className={styles.statNum}>{inProgress}</span>
            <span className={styles.statLabel}>학습 중</span>
          </div>
        </div>

        {/* 필터 */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            {categories.map(cat => (
              <button key={cat} className={`${styles.filterBtn} ${catFilter === cat ? styles.active : ''}`} onClick={() => setCatFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            {['전체', '학습 중', '완료'].map(s => (
              <button key={s} className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ''}`} onClick={() => setStatusFilter(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 카드 그리드 */}
        {loading ? (
          <p className={styles.loading}>불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>해당하는 항목이 없습니다.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((log, i) => (
              <article
                key={log.id}
                className={styles.card}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => setDetailLog(log)}
              >
                <div className={styles.cardTop}>
                  <span className={styles.catBadge} style={{ background: CATEGORY_COLORS[log.category] ?? 'var(--cat-etc)' }}>
                    {log.category}
                  </span>
                  <div className={styles.cardTopRight}>
                    <span className={`${styles.statusBadge} ${log.status === '완료' ? styles.done : styles.wip}`}>
                      {log.status === '완료' ? <FiCheckCircle /> : <FiLoader />}
                      {log.status}
                    </span>
                    {isAdmin && (
                      <div className={styles.adminBtns}>
                        <button className={styles.editBtn} onClick={(e) => openEdit(log, e)} aria-label="수정"><FiEdit2 /></button>
                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(log.id, e)} aria-label="삭제"><FiTrash2 /></button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className={styles.title}>{log.title}</h3>

                {log.memo && (
                  <div className={`${styles.memoPreview} ${styles.markdown}`}>
                    <ReactMarkdown>{log.memo}</ReactMarkdown>
                  </div>
                )}

                <div className={styles.cardBottom}>
                  <span className={styles.date}>
                    {new Date(log.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  {log.reference_url && (
                    <a href={log.reference_url} target="_blank" rel="noopener noreferrer" className={styles.refLink} onClick={e => e.stopPropagation()}>
                      <FiExternalLink /> 참고 자료
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {detailLog && (
        <div className={styles.overlay} onClick={() => setDetailLog(null)}>
          <div className={`${styles.modal} ${styles.detailModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.detailMeta}>
                <span className={styles.catBadge} style={{ background: CATEGORY_COLORS[detailLog.category] ?? 'var(--cat-etc)' }}>
                  {detailLog.category}
                </span>
                <span className={`${styles.statusBadge} ${detailLog.status === '완료' ? styles.done : styles.wip}`}>
                  {detailLog.status === '완료' ? <FiCheckCircle /> : <FiLoader />}
                  {detailLog.status}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={() => setDetailLog(null)}><FiX /></button>
            </div>

            <h2 className={styles.detailTitle}>{detailLog.title}</h2>
            <p className={styles.detailDate}>
              {new Date(detailLog.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {detailLog.memo && (
              <div className={`${styles.detailContent} ${styles.markdown}`}>
                <ReactMarkdown>{detailLog.memo}</ReactMarkdown>
              </div>
            )}

            {detailLog.reference_url && (
              <a href={detailLog.reference_url} target="_blank" rel="noopener noreferrer" className={styles.detailRefLink}>
                <FiExternalLink /> 참고 자료 바로가기
              </a>
            )}
          </div>
        </div>
      )}

      {/* 비밀번호 모달 */}
      {showPwModal && (
        <div className={styles.overlay} onClick={() => { setShowPwModal(false); setPwInput(''); setPwError('') }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>관리자 확인</h3>
              <button className={styles.closeBtn} onClick={() => { setShowPwModal(false); setPwInput(''); setPwError('') }}><FiX /></button>
            </div>
            <form onSubmit={handlePwSubmit} className={styles.pwForm}>
              <input type="password" placeholder="비밀번호" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError('') }} className={styles.input} autoFocus />
              {pwError && <p className={styles.errorMsg}>{pwError}</p>}
              <button type="submit" className={styles.submitBtn}>확인</button>
            </form>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={`${styles.modal} ${styles.formModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editTarget ? '기록 수정' : '기록 추가'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.logForm}>
              <label className={styles.label}>
                제목 <span className={styles.required}>*</span>
                <input type="text" placeholder="공부한 내용을 입력하세요" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={styles.input} required />
              </label>

              <div className={styles.row}>
                <label className={styles.label}>
                  카테고리
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={styles.input}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className={styles.label}>
                  상태
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={styles.input}>
                    <option>학습 중</option>
                    <option>완료</option>
                  </select>
                </label>
              </div>

              {/* 마크다운 에디터 */}
              <div className={styles.label}>
                <div className={styles.editorHeader}>
                  <span>내용 <span className={styles.optional}>(Markdown 지원)</span></span>
                  <div className={styles.tabBtns}>
                    <button type="button" className={`${styles.tabBtn} ${formTab === 'write' ? styles.tabActive : ''}`} onClick={() => setFormTab('write')}>
                      <FiEdit /> 작성
                    </button>
                    <button type="button" className={`${styles.tabBtn} ${formTab === 'preview' ? styles.tabActive : ''}`} onClick={() => setFormTab('preview')}>
                      <FiEye /> 미리보기
                    </button>
                  </div>
                </div>
                {formTab === 'write' ? (
                  <textarea
                    placeholder={`# 제목\n\n## 내용\n\n- 항목 1\n- 항목 2\n\n\`\`\`js\nconsole.log('Hello')\n\`\`\``}
                    value={form.memo}
                    onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
                    className={`${styles.input} ${styles.mdTextarea}`}
                    rows={12}
                  />
                ) : (
                  <div className={`${styles.mdPreview} ${styles.markdown}`}>
                    {form.memo ? <ReactMarkdown>{form.memo}</ReactMarkdown> : <p className={styles.previewEmpty}>내용을 입력하면 여기에 미리보기가 표시됩니다.</p>}
                  </div>
                )}
              </div>

              <label className={styles.label}>
                참고 자료 URL <span className={styles.optional}>(선택)</span>
                <input type="url" placeholder="https://..." value={form.reference_url} onChange={e => setForm(f => ({ ...f, reference_url: e.target.value }))} className={styles.input} />
              </label>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? '저장 중...' : editTarget ? '수정 완료' : '추가'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
