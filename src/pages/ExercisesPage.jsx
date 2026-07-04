import { useState, useMemo, useEffect, useCallback } from 'react'
import { initAllAnimations } from '../utils/animations'
import { useSearchParams } from 'react-router-dom'
import exercisesData from '../data/exercises.json'
import './ExercisesPage.css'

const BODY_PARTS = ['??', ...new Set(exercisesData.map(e => e.body_part))]
const EQUIPMENT_TYPES = ['??', ...new Set(exercisesData.map(e => e.equipment))].sort()

const BODY_PART_CN = {
  'waist': '??', 'upper legs': '??', 'back': '??',
  'lower legs': '??', 'chest': '??', 'upper arms': '??',
  'cardio': '??', 'shoulders': '??', 'lower arms': '??', 'neck': '??'
}
function bpLabel(part) {
  return BODY_PART_CN[part] || part
}

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises'

function nameToFilename(name) {
  return name
    .split(' ')
    .map(w => w.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-'))
    .join('_')
    .replace(/\//g, '_')
}

function ExercisesPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(() => searchParams.get('category') || '??')
  const [equipment, setEquipment] = useState('??')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [failedImages, setFailedImages] = useState(new Set())
  const [visibleCount, setVisibleCount] = useState(48)

  const handleImageError = useCallback((id, isCard = false) => {
    setFailedImages(prev => new Set(prev).add(id + (isCard ? '-card' : '')))
  }, [])

  const filtered = useMemo(() => {
    return exercisesData.filter(ex => {
      const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.target.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === '??' || ex.body_part === category
      const matchEquip = equipment === '??' || ex.equipment === equipment
      return matchSearch && matchCat && matchEquip
    })
  }, [search, category, equipment])

  const visible = filtered.slice(0, visibleCount)

  function getCdnUrl(name) {
    return CDN_BASE + '/' + nameToFilename(name) + '/0.jpg'
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelectedExercise(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="exercises-page">
      <div className="container">
        <div className="exercises-header">
          <span className="section-label">?????</span>
          <h2 className="section-title">?????</h2>
          <p className="section-desc">?? {exercisesData.length.toLocaleString()} ???????????????????</p>
        </div>

        <div className="exercises-filters">
          <div className="filter-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="???????????..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filter-selects">
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {BODY_PARTS.map(part => (<option key={part} value={part}>{part === '??' ? '????' : bpLabel(part)}</option>))}
            </select>
            <select value={equipment} onChange={e => setEquipment(e.target.value)}>
              {EQUIPMENT_TYPES.map(eq => (<option key={eq} value={eq}>{eq === '??' ? '????' : eq}</option>))}
            </select>
          </div>

          <div className="filter-count">?? <span>{filtered.length}</span> ???</div>
        </div>

        <div className="exercises-grid">
          {visible.map(ex => {
            const imgFailed = failedImages.has(ex.id + '-card')
            return (
            <div key={ex.id} className="exercise-card " onClick={() => setSelectedExercise(ex)}>
              <div className="exercise-card-image">
                {!imgFailed ? (
                  <img
                    className="exercise-card-img"
                    src={getCdnUrl(ex.name)}
                    alt={ex.name}
                    loading="lazy"
                    onError={() => handleImageError(ex.id, true)}
                  />
                ) : null}
                <div className={"exercise-card-placeholder" + (imgFailed ? '' : ' exercise-card-placeholder-hidden')}>
                  <span className="placeholder-icon">{getBodyPartIcon(ex.body_part)}</span>
                </div>
                <div className="exercise-card-category">{bpLabel(ex.body_part)}</div>
              </div>
              <div className="exercise-card-body">
                <h3 className="exercise-card-name">{ex.name}</h3>
                <div className="exercise-card-tags">
                  <span className="tag tag-target">{ex.target}</span>
                  <span className="tag tag-equip">{ex.equipment}</span>
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {visibleCount < filtered.length && (
          <div className="exercises-load-more">
            <button onClick={() => setVisibleCount(prev => prev + 48)} className="btn-load-more">???? ({filtered.length - visibleCount} ???)</button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="exercises-empty">
            <div className="empty-icon">??</div>
            <h3>????????</h3>
            <p>??????????????</p>
          </div>
        )}

        {selectedExercise && (
          <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
            <div className="modal-content " onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedExercise(null)}>?</button>
              <div className="modal-media">
                {!failedImages.has(selectedExercise.id + '-modal') ? (
                  <img
                    className="modal-gif-img"
                    src={getCdnUrl(selectedExercise.name)}
                    alt={selectedExercise.name}
                    onError={() => setFailedImages(prev => new Set(prev).add(selectedExercise.id + '-modal'))}
                  />
                ) : null}
                <div className={"modal-placeholder" + (failedImages.has(selectedExercise.id + '-modal') ? '' : ' modal-placeholder-hidden')}>
                  <span className="placeholder-icon large">{getBodyPartIcon(selectedExercise.body_part)}</span>
                </div>
              </div>
              <div className="modal-details">
                <h2 className="modal-title">{selectedExercise.name}</h2>
                <div className="modal-meta-tags">
                  <span className="meta-tag">??: {bpLabel(selectedExercise.body_part)}</span>
                  <span className="meta-tag">??: {selectedExercise.target}</span>
                  <span className="meta-tag">??: {selectedExercise.equipment}</span>
                </div>
                {selectedExercise.instructions?.zh && (
                  <div className="modal-instructions"><h3 className="modal-section-title">????</h3><p>{selectedExercise.instructions.zh}</p></div>
                )}
                {selectedExercise.instruction_steps?.zh && (
                  <div className="modal-instructions"><h3 className="modal-section-title">????</h3>
                    <ol className="steps-list">{selectedExercise.instruction_steps.zh.map((step, i) => (<li key={i} className="step-item"><span className="step-num">{i+1}</span><span className="step-text">{step}</span></li>))}</ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getBodyPartIcon(part) {
  const icons = { waist: '??', chest: '??', back: '???', shoulders: '??', 'upper arms': '??', 'lower arms': '??', 'upper legs': '??', 'lower legs': '??', neck: '??', cardio: '??' }
  return icons[part] || '???'
}

export default ExercisesPage
