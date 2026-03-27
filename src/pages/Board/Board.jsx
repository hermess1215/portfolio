import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit3, FiTrash2, FiEye, FiAlertCircle, FiEdit } from 'react-icons/fi'
import supabase from '../../supabase'
import styles from './Board.module.css'

export default function Board() {
  const [view, setView] = useState('list')
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', author: '', password: '', content: '' })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ===== 목록 불러오기 =====
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('posts')
      .select('id, title, author, views, created_at')
      .order('created_at', { ascending: false })
    if (err) setError('게시글을 불러오지 못했습니다.')
    else setPosts(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  // ===== 상세 보기 =====
  const openDetail = async (post) => {
    setLoading(true)
    setError('')

    // 조회수 증가
    await supabase.from('posts').update({ views: post.views + 1 }).eq('id', post.id)

    const { data, error: err } = await supabase
      .from('posts')
      .select('id, title, author, content, views, created_at')
      .eq('id', post.id)
      .single()

    if (err) {
      setError('게시글을 불러오지 못했습니다.')
    } else {
      setSelectedPost(data)
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: data.views } : p))
      setView('detail')
      window.scrollTo(0, 0)
    }
    setLoading(false)
  }

  const goToWrite = () => {
    setForm({ title: '', author: '', password: '', content: '' })
    setFormErrors({})
    setError('')
    setView('write')
    window.scrollTo(0, 0)
  }

  const goToList = () => {
    setView('list')
    setSelectedPost(null)
    setError('')
    window.scrollTo(0, 0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (formErrors[name]) setFormErrors(err => ({ ...err, [name]: '' }))
  }

  // ===== 글 등록 =====
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = '제목을 입력해주세요'
    if (!form.author.trim()) errs.author = '작성자를 입력해주세요'
    if (!form.password) errs.password = '비밀번호를 입력해주세요'
    if (!form.content.trim()) errs.content = '내용을 입력해주세요'
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('posts').insert([{
      title:   form.title.trim(),
      author:  form.author.trim(),
      password: form.password,
      content: form.content.trim(),
    }])
    if (err) {
      setError('게시글 작성에 실패했습니다.')
    } else {
      await fetchPosts()
      goToList()
    }
    setSubmitting(false)
  }

  // ===== 수정 시작 (비밀번호 확인 후 edit 뷰로) =====
  const handleEditStart = async () => {
    if (!selectedPost) return
    const pw = window.prompt('수정하려면 비밀번호를 입력하세요')
    if (pw === null) return

    const { data } = await supabase
      .from('posts')
      .select('password')
      .eq('id', selectedPost.id)
      .single()

    if (!data || data.password !== pw) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    setForm({ title: selectedPost.title, content: selectedPost.content })
    setFormErrors({})
    setError('')
    setView('edit')
    window.scrollTo(0, 0)
  }

  // ===== 수정 저장 =====
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = '제목을 입력해주세요'
    if (!form.content.trim()) errs.content = '내용을 입력해주세요'
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setSubmitting(true)
    setError('')
    const { error: err } = await supabase
      .from('posts')
      .update({ title: form.title.trim(), content: form.content.trim() })
      .eq('id', selectedPost.id)

    if (err) {
      setError('수정에 실패했습니다.')
    } else {
      const updated = { ...selectedPost, title: form.title.trim(), content: form.content.trim() }
      setSelectedPost(updated)
      setPosts(prev => prev.map(p => p.id === updated.id ? { ...p, title: updated.title } : p))
      setView('detail')
      window.scrollTo(0, 0)
    }
    setSubmitting(false)
  }

  // ===== 글 삭제 =====
  const handleDelete = async () => {
    if (!selectedPost) return
    const pw = window.prompt('삭제하려면 비밀번호를 입력하세요')
    if (pw === null) return

    setLoading(true)
    // 비밀번호 확인
    const { data } = await supabase
      .from('posts')
      .select('password')
      .eq('id', selectedPost.id)
      .single()

    if (!data || data.password !== pw) {
      alert('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    const { error: err } = await supabase.from('posts').delete().eq('id', selectedPost.id)
    if (err) {
      alert('삭제에 실패했습니다.')
    } else {
      await fetchPosts()
      goToList()
    }
    setLoading(false)
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })

  // ===== LIST VIEW =====
  if (view === 'list') return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.backRow}>
          <Link to="/" className={styles.backLink}><FiArrowLeft /> 포트폴리오로 돌아가기</Link>
        </div>
        <div className={styles.pageHeader}>
          <span className="section-label">GUESTBOOK</span>
          <h1 className="section-title">방명록</h1>
          <div className="section-divider" />
          <p className={styles.subtitle}>방문해주셔서 감사합니다. 자유롭게 글을 남겨주세요!</p>
        </div>

        {error && <div className={styles.errorBanner}><FiAlertCircle /> {error}</div>}

        <div className={styles.listActions}>
          <span className={styles.postCount}>총 {posts.length}개의 글</span>
          <button className="btn btn-primary" onClick={goToWrite}><FiEdit3 /> 글쓰기</button>
        </div>

        {loading ? (
          <div className={styles.loading}>불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <p>아직 작성된 글이 없습니다.</p>
            <p>첫 번째 방명록을 남겨보세요!</p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={`${styles.tableRow} ${styles.tableHead}`}>
              <span className={styles.colNum}>번호</span>
              <span className={styles.colTitle}>제목</span>
              <span className={styles.colAuthor}>작성자</span>
              <span className={styles.colDate}>날짜</span>
              <span className={styles.colViews}><FiEye /></span>
            </div>
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className={styles.tableRow}
                onClick={() => openDetail(post)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openDetail(post)}
              >
                <span className={styles.colNum}>{posts.length - idx}</span>
                <span className={styles.colTitle}>{post.title}</span>
                <span className={styles.colAuthor}>{post.author}</span>
                <span className={styles.colDate}>{formatDate(post.created_at)}</span>
                <span className={styles.colViews}>{post.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )

  // ===== WRITE VIEW =====
  if (view === 'write') return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.backRow}>
          <button className={styles.backLink} onClick={goToList}><FiArrowLeft /> 목록으로</button>
        </div>
        <div className={styles.pageHeader}>
          <span className="section-label">WRITE</span>
          <h1 className="section-title">글쓰기</h1>
          <div className="section-divider" />
        </div>

        {error && <div className={styles.errorBanner}><FiAlertCircle /> {error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">제목 *</label>
            <input id="title" name="title" value={form.title} onChange={handleChange}
              className={`${styles.input} ${formErrors.title ? styles.inputError : ''}`}
              placeholder="제목을 입력하세요" maxLength={200} />
            {formErrors.title && <span className={styles.fieldError}>{formErrors.title}</span>}
          </div>

          <div className={styles.formRow2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="author">작성자 *</label>
              <input id="author" name="author" value={form.author} onChange={handleChange}
                className={`${styles.input} ${formErrors.author ? styles.inputError : ''}`}
                placeholder="이름 또는 닉네임" maxLength={50} />
              {formErrors.author && <span className={styles.fieldError}>{formErrors.author}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                비밀번호 * <small>(삭제 시 필요)</small>
              </label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange}
                className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                placeholder="••••••" />
              {formErrors.password && <span className={styles.fieldError}>{formErrors.password}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="content">내용 *</label>
            <textarea id="content" name="content" value={form.content} onChange={handleChange}
              className={`${styles.textarea} ${formErrors.content ? styles.inputError : ''}`}
              placeholder="내용을 자유롭게 입력하세요..." rows={8} />
            {formErrors.content && <span className={styles.fieldError}>{formErrors.content}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={goToList} disabled={submitting}>취소</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )

  // ===== DETAIL VIEW =====
  if (view === 'detail' && selectedPost) return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.backRow}>
          <button className={styles.backLink} onClick={goToList}><FiArrowLeft /> 목록으로</button>
        </div>

        {error && <div className={styles.errorBanner}><FiAlertCircle /> {error}</div>}

        <div className={styles.detailCard}>
          <h2 className={styles.detailTitle}>{selectedPost.title}</h2>
          <div className={styles.detailMeta}>
            <span>{selectedPost.author}</span>
            <span>{formatDate(selectedPost.created_at)}</span>
            <span className={styles.metaViews}><FiEye /> {selectedPost.views}</span>
          </div>
          <div className={styles.divider} />
          <p className={styles.detailContent}>{selectedPost.content}</p>
          <div className={styles.detailActions}>
            <button className={styles.editBtn} onClick={handleEditStart} disabled={loading}>
              <FiEdit /> 수정
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
              <FiTrash2 /> {loading ? '처리 중...' : '삭제'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  // ===== EDIT VIEW =====
  if (view === 'edit' && selectedPost) return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.backRow}>
          <button className={styles.backLink} onClick={() => setView('detail')}>
            <FiArrowLeft /> 돌아가기
          </button>
        </div>
        <div className={styles.pageHeader}>
          <span className="section-label">EDIT</span>
          <h1 className="section-title">글 수정</h1>
          <div className="section-divider" />
        </div>

        {error && <div className={styles.errorBanner}><FiAlertCircle /> {error}</div>}

        <form className={styles.form} onSubmit={handleEditSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-title">제목 *</label>
            <input id="edit-title" name="title" value={form.title} onChange={handleChange}
              className={`${styles.input} ${formErrors.title ? styles.inputError : ''}`}
              placeholder="제목을 입력하세요" maxLength={200} />
            {formErrors.title && <span className={styles.fieldError}>{formErrors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-content">내용 *</label>
            <textarea id="edit-content" name="content" value={form.content} onChange={handleChange}
              className={`${styles.textarea} ${formErrors.content ? styles.inputError : ''}`}
              placeholder="내용을 입력하세요..." rows={8} />
            {formErrors.content && <span className={styles.fieldError}>{formErrors.content}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={() => setView('detail')} disabled={submitting}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )

  return null
}
