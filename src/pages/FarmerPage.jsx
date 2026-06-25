import { useEffect, useState } from 'react'
import { getAllFarmers, createFarmer } from '../services/farmerService'

export default function FarmerPage() {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', village: '' })

  useEffect(() => {
    loadFarmers()
  }, [])

  async function loadFarmers() {
    try {
      const { data } = await getAllFarmers()
      setFarmers(data)
    } catch {
      alert('రైతుల డేటా లోడ్ చేయడంలో సమస్య')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!form.name) return alert('రైతు పేరు పూరించండి')
    try {
      const { data } = await createFarmer(form)
      setFarmers([data, ...farmers])
      setShowModal(false)
      setForm({ name: '', phone: '', village: '' })
    } catch {
      alert('రైతు సేవ్ చేయడంలో సమస్య')
    }
  }

  const filtered = farmers.filter(f =>
    f.name.includes(search) || f.village.includes(search) || f.phone.includes(search)
  )

  const totalDue = farmers.reduce((s, f) => s + f.totalDue, 0)
  const totalPaid = farmers.reduce((s, f) => s + f.totalPaid, 0)

  if (loading) return <div className="loading-state">లోడ్ అవుతోంది...</div>

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">మొత్తం రైతులు</div>
          <div className="stat-value">{farmers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">మొత్తం చెల్లించారు</div>
          <div className="stat-value">₹{totalPaid.toLocaleString('te-IN')}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">మొత్తం బకాయి</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>₹{totalDue.toLocaleString('te-IN')}</div>
        </div>
      </div>

      <div className="card">
        <div className="page-header">
          <h2>👨‍🌾 రైతుల వివరాలు</h2>
          <div className="page-toolbar">
            <input
              className="search-input"
              placeholder="🔍 పేరు / గ్రామం / ఫోన్ వెతకండి"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ కొత్త రైతు</button>
          </div>
        </div>

        <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>రైతు పేరు</th>
              <th>ఫోన్</th>
              <th>గ్రామం</th>
              <th>మొత్తం ఎకరాలు</th>
              <th>చెల్లించారు</th>
              <th>బకాయి</th>
              <th>స్థితి</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.id}>
                <td style={{ color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                <td>
                  <div style={{ fontWeight: 700 }}>{f.name}</div>
                </td>
                <td style={{ fontSize: 13 }}>📞 {f.phone}</td>
                <td>📍 {f.village}</td>
                <td>{f.totalAcres} ఎకరాలు</td>
                <td style={{ fontWeight: 600, color: '#166534' }}>₹{f.totalPaid.toLocaleString('te-IN')}</td>
                <td style={{ fontWeight: 700, color: f.totalDue > 0 ? '#dc2626' : '#166534' }}>
                  ₹{f.totalDue.toLocaleString('te-IN')}
                </td>
                <td>
                  <span className={`badge ${f.totalDue === 0 ? 'badge-green' : 'badge-red'}`}>
                    {f.totalDue === 0 ? '✅ క్లియర్' : '⚠️ బకాయి'}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>రైతులు కనుగొనలేదు</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>👨‍🌾 కొత్త రైతు నమోదు</h3>
            <div className="form-group">
              <label>రైతు పేరు *</label>
              <input placeholder="పూర్తి పేరు" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>ఫోన్ నంబర్</label>
              <input placeholder="10 అంకెల నంబర్" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>గ్రామం</label>
              <input placeholder="గ్రామం పేరు" value={form.village} onChange={e => setForm({...form, village: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>రద్దు</button>
              <button className="btn btn-primary" onClick={handleSubmit}>💾 సేవ్ చేయి</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
