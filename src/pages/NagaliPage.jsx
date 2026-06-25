import { useEffect, useState } from 'react'
import { nagaliTypes, nagaliRates } from '../services/mockData'
import { getAllBookings, createBooking } from '../services/bookingService'

const nagaliInfo = {
  'గొర్రు': { desc: 'సాధారణ దుక్కి పని', icon: '🌾', color: '#2d7a3a' },
  'మిరప గొర్రు': { desc: 'మిర్చి పొలం తయారీ', icon: '🌶️', color: '#dc2626' },
  'వితనం గొర్రు': { desc: 'విత్తనాల నాటుకు', icon: '🌱', color: '#16a34a' },
  'బోతె గొర్రు': { desc: 'బీడు భూమి దుక్కి', icon: '🏗️', color: '#8b5e3c' },
}

export default function NagaliPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState('అన్నీ')
  const [form, setForm] = useState({
    farmer: '', village: '', nagaliType: 'గొర్రు',
    acres: '', date: new Date().toISOString().split('T')[0], paid: false
  })

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      const { data } = await getAllBookings()
      setRecords(data)
    } catch {
      alert('రికార్డులు లోడ్ చేయడంలో సమస్య')
    } finally {
      setLoading(false)
    }
  }

  const rate = nagaliRates[form.nagaliType] || 0
  const total = (parseFloat(form.acres) || 0) * rate

  async function handleSubmit() {
    if (!form.farmer || !form.acres) return alert('పేరు మరియు ఎకరాలు పూరించండి')
    try {
      const payload = {
        farmer: form.farmer,
        village: form.village,
        nagaliType: form.nagaliType,
        acres: parseFloat(form.acres),
        ratePerAcre: rate,
        totalAmount: total,
        date: form.date,
        paid: form.paid,
      }
      const { data } = await createBooking(payload)
      setRecords([data, ...records])
      setShowModal(false)
      setForm({ farmer: '', village: '', nagaliType: 'గొర్రు', acres: '', date: new Date().toISOString().split('T')[0], paid: false })
    } catch {
      alert('రికార్డు సేవ్ చేయడంలో సమస్య')
    }
  }

  const filtered = selectedType === 'అన్నీ' ? records : records.filter(r => r.nagaliType === selectedType)

  const typeSummary = nagaliTypes.map(t => ({
    type: t,
    count: records.filter(r => r.nagaliType === t).length,
    acres: records.filter(r => r.nagaliType === t).reduce((s, r) => s + r.acres, 0),
    income: records.filter(r => r.nagaliType === t).reduce((s, r) => s + r.totalAmount, 0),
    ...nagaliInfo[t],
  }))

  if (loading) return <div className="loading-state">లోడ్ అవుతోంది...</div>

  return (
    <div>
      <div className="nagali-type-grid">
        {typeSummary.map(t => (
          <button
            key={t.type}
            type="button"
            className="nagali-type-card"
            onClick={() => setSelectedType(selectedType === t.type ? 'అన్నీ' : t.type)}
            style={{
              background: selectedType === t.type ? t.color : '#fff',
              color: selectedType === t.type ? '#fff' : '#1f2937',
              border: `2px solid ${t.color}`,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{t.type}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>{t.desc}</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{t.acres} ఎకరాలు</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{t.count} రైతులు • ₹{t.income.toLocaleString('te-IN')}</div>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="page-header">
          <div>
            <h2>⚙️ నాగలి పని రికార్డులు</h2>
            {selectedType !== 'అన్నీ' && (
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
                Filter: <span style={{ color: '#2d7a3a', fontWeight: 600 }}>{selectedType}</span>
                <button onClick={() => setSelectedType('అన్నీ')} style={{ marginLeft: 8, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>✕ తొలగించు</button>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ కొత్త రికార్డు</button>
        </div>

        <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>రైతు పేరు</th>
              <th>గ్రామం</th>
              <th>నాగలి రకం</th>
              <th>ఎకరాలు</th>
              <th>రేటు/ఎకరా</th>
              <th>మొత్తం</th>
              <th>తేదీ</th>
              <th>చెల్లింపు</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.farmer}</td>
                <td>{r.village}</td>
                <td>
                  <span style={{
                    background: nagaliInfo[r.nagaliType]?.color + '20',
                    color: nagaliInfo[r.nagaliType]?.color,
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {nagaliInfo[r.nagaliType]?.icon} {r.nagaliType}
                  </span>
                </td>
                <td>{r.acres}</td>
                <td>₹{r.ratePerAcre}</td>
                <td style={{ fontWeight: 700 }}>₹{r.totalAmount.toLocaleString('te-IN')}</td>
                <td style={{ fontSize: 13, color: '#9ca3af' }}>{r.date}</td>
                <td>
                  <span className={`badge ${r.paid ? 'badge-green' : 'badge-red'}`}>
                    {r.paid ? '✅ అయింది' : '⏳ లేదు'}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>రికార్డులు లేవు</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⚙️ కొత్త నాగలి పని రికార్డు</h3>
            <div className="form-group">
              <label>రైతు పేరు *</label>
              <input placeholder="పేరు" value={form.farmer} onChange={e => setForm({...form, farmer: e.target.value})} />
            </div>
            <div className="form-group">
              <label>గ్రామం</label>
              <input placeholder="గ్రామం" value={form.village} onChange={e => setForm({...form, village: e.target.value})} />
            </div>
            <div className="form-group">
              <label>నాగలి రకం</label>
              <select value={form.nagaliType} onChange={e => setForm({...form, nagaliType: e.target.value})}>
                {nagaliTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>ఎకరాలు *</label>
                <input type="number" step="0.5" placeholder="ఎకరాలు" value={form.acres} onChange={e => setForm({...form, acres: e.target.value})} />
              </div>
              <div className="form-group">
                <label>తేదీ</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>
            {form.acres && (
              <div className="rate-preview">
                <div className="rate-preview__detail">₹{rate}/ఎకరా × {form.acres} = </div>
                <div className="rate-preview__total">₹{total.toLocaleString('te-IN')}</div>
              </div>
            )}
            <div className="form-group checkbox-row">
              <input type="checkbox" id="paid2" checked={form.paid} onChange={e => setForm({...form, paid: e.target.checked})} />
              <label htmlFor="paid2">చెల్లించారు</label>
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
