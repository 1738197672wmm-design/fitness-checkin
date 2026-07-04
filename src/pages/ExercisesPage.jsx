import { useState, useMemo, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import { useSearchParams } from 'react-router-dom'
import exercisesData from '../data/exercises.json'
import './ExercisesPage.css'

const BODY_PARTS = ['全部', ...new Set(exercisesData.map(e => e.body_part))]
const EQUIPMENT_TYPES = ['全部', ...new Set(exercisesData.map(e => e.equipment))].sort()

const BODY_PART_CN = {
  'waist': '腰腹', 'upper legs': '大腿', 'back': '背部',
  'lower legs': '小腿', 'chest': '胸部', 'upper arms': '上臂',
  'cardio': '有氧', 'shoulders': '肩部', 'lower arms': '前臂', 'neck': '颈部'
}
function bpLabel(part) {
  return BODY_PART_CN[part] || part
}

function ExercisesPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(() => searchParams.get('category') || '全部')
  const [equipment, setEquipment] = useState('全部')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [visibleCount, setVisibleCount] = useState(48)

  const filtered = useMemo(() => {
    return exercisesData.filter(ex => {
      const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.target.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === '全部' || ex.body_part === category
      const matchEquip = equipment === '全部' || ex.equipment === equipment
      return matchSearch && matchCat && matchEquip
    })
  }, [search, category, equipment])

  const visible = filtered.slice(0, visibleCount)

  const getCdnImage = () => null
  const getCdnGif = () => null

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelectedExercise(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="exercises-page">
      <div className="container">
        <div className="exercises-header">
          <span className="section-label">健身动作库</span>
          <h2 className="section-title">健身动作库</h2>
          <p className="section-desc">探索 {exercisesData.length.toLocaleString()} 个专业健身动作，找到最适合你的训练方式</p>
        </div>

        <div className="exercises-filters">
          <div className="filter-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="搜索动作名称、目标肌肉..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filter-selects">
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {BODY_PARTS.map(part => (<option key={part} value={part}>{part === '全部' ? '所有部位' : bpLabel(part)}</option>))}
            </select>
            <select value={equipment} onChange={e => setEquipment(e.target.value)}>
              {EQUIPMENT_TYPES.map(eq => (<option key={eq} value={eq}>{eq === '全部' ? '所有器械' : eq}</option>))}
            </select>
          </div>

          <div className="filter-count">找到 <span>{filtered.length}</span> 个动作</div>
        </div>

        <div className="exercises-grid">
          {visible.map(ex => (
            <div key={ex.id} className="exercise-card " onClick={() => setSelectedExercise(ex)}>
              <div className="exercise-card-image">
                <div className="exercise-card-placeholder"><span className="placeholder-icon">{getBodyPartIcon(ex.body_part)}</span></div>
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
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="exercises-load-more">
            <button onClick={() => setVisibleCount(prev => prev + 48)} className="btn-load-more">加载更多 ({filtered.length - visibleCount} 个剩余)</button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="exercises-empty">
            <div className="empty-icon">🔍</div>
            <h3>未找到匹配的动作</h3>
            <p>尝试更换搜索关键词或筛选条件</p>
          </div>
        )}

        {selectedExercise && (
          <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
            <div className="modal-content " onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedExercise(null)}>×</button>
              <div className="modal-media">
                <div className="modal-placeholder"><span className="placeholder-icon large">{getBodyPartIcon(selectedExercise.body_part)}</span></div>
              </div>
              <div className="modal-details">
                <h2 className="modal-title">{selectedExercise.name}</h2>
                <div className="modal-meta-tags">
                  <span className="meta-tag">部位: {bpLabel(selectedExercise.body_part)}</span>
                  <span className="meta-tag">目标: {selectedExercise.target}</span>
                  <span className="meta-tag">器械: {selectedExercise.equipment}</span>
                </div>
                {selectedExercise.instructions?.zh && (
                  <div className="modal-instructions"><h3 className="modal-section-title">动作说明</h3><p>{selectedExercise.instructions.zh}</p></div>
                )}
                {selectedExercise.instruction_steps?.zh && (
                  <div className="modal-instructions"><h3 className="modal-section-title">步骤分解</h3>
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
  const icons = { waist: '🧘', chest: '💪', back: '🏋️', shoulders: '🦾', 'upper arms': '💪', 'lower arms': '🦾', 'upper legs': '🦵', 'lower legs': '🦶', neck: '🧘', cardio: '🏃' }
  return icons[part] || '🏋️'
}

export default ExercisesPage