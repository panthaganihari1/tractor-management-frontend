import { useEffect, useState } from 'react'
import { nagaliTypes, nagaliRates } from '../services/mockData'
import { getAllBookings, createBooking, updatePaymentStatus } from '../services/bookingService'

export default function TractorPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    farmer: '', village: '', nagaliType: 'గొర్రు', acres: '', date: new Date().toISOString().split('T')[0], paid: false
  })

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    try {
      const { data } = await getAllBookings()
      setBookings(data)
    } catch {
      alert('బుకింగ్స్ లోడ్ చేయడంలో సమస్య')
    } finally {
      setLoading(false)
    }
  }

  const rate = nagaliRates[form.nagaliType] || 0
  const total = (parseFloat(form.acres) || 0) * rate

  async function handleSubmit() {
    if (!form.farmer || !form.acres) return alert('రైతు పేరు మరియు ఎకరాలు పూరించండి')
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
      setBookings([data, ...bookings])
      setShowModal(false)
      setForm({ farmer: '', village: '', nagaliType: 'గొర్రు', acres: '', date: new Date().toISOString().split('T')[0], paid: false })
    } catch {
      alert('బుకింగ్ సేవ్ చేయడంలో సమస్య')
    }
  }

  async function togglePaid(id, currentPaid) {
    try {
      const { data } = await updatePaymentStatus(id, !currentPaid)
      setBookings(bookings.map(b => b.id === id ? data : b))
    } catch {
      alert('చెల్లింపు స్థితి మార్చడంలో సమస్య')
    }
  }

  const totalIncome = bookings.reduce((s, b) => s + b.totalAmount, 0)
  const totalPaid = bookings.filter(b => b.paid).reduce((s, b) => s + b.totalAmount, 0)
  const totalDue = totalIncome - totalPaid

  if (loading) return <div className="loading-state">లోడ్ అవుతోంది...</div>

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">మొత్తం బుకింగ్స్</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">మొత్తం ఆదాయం</div>
          <div className="stat-value">₹{totalIncome.toLocaleString('te-IN')}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">చెల్లించారు</div>
          <div className="stat-value">₹{totalPaid.toLocaleString('te-IN')}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">బకాయి</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>₹{totalDue.toLocaleString('te-IN')}</div>
        </div>
      </div>

      <div className="card">
        <div className="page-header">
          <h2>🚜 Tractor అద్దె రికార్డులు</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ కొత్త బుకింగ్</button>
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
              <th>స్థితి</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{b.farmer}</td>
                <td>{b.village}</td>
                <td><span className="badge badge-amber">{b.nagaliType}</span></td>
                <td>{b.acres}</td>
                <td>₹{b.ratePerAcre}</td>
                <td style={{ fontWeight: 700 }}>₹{b.totalAmount.toLocaleString('te-IN')}</td>
                <td style={{ fontSize: 13, color: '#9ca3af' }}>{b.date}</td>
                <td>
                  <button
                    onClick={() => togglePaid(b.id, b.paid)}
                    className="badge"
                    style={{
                      cursor: 'pointer',
                      background: b.paid ? '#dcfce7' : '#fee2e2',
                      color: b.paid ? '#166534' : '#dc2626',
                      border: 'none',
                    }}
                  >
                    {b.paid ? '✅ చెల్లించారు' : '⏳ బకాయి'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🚜 కొత్త Tractor బుకింగ్</h3>

            <div className="form-group">
              <label>రైతు పేరు *</label>
              <input placeholder="రైతు పేరు నమోదు చేయండి" value={form.farmer} onChange={e => setForm({...form, farmer: e.target.value})} />
            </div>
            <div className="form-group">
              <label>గ్రామం</label>
              <input placeholder="గ్రామం పేరు" value={form.village} onChange={e => setForm({...form, village: e.target.value})} />
            </div>
            <div className="form-group">
              <label>నాగలి రకం</label>
              <select value={form.nagaliType} onChange={e => setForm({...form, nagaliType: e.target.value})}>
                {nagaliTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>ఎకరాలు *</label>
                <input type="number" min="0.5" step="0.5" placeholder="ఎకరాలు" value={form.acres} onChange={e => setForm({...form, acres: e.target.value})} />
              </div>
              <div className="form-group">
                <label>తేదీ</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>

            {form.acres && (
              <div className="rate-preview">
                <div className="rate-preview__detail">రేటు: ₹{rate}/ఎకరా × {form.acres} ఎకరాలు</div>
                <div className="rate-preview__total">మొత్తం: ₹{total.toLocaleString('te-IN')}</div>
              </div>
            )}

            <div className="form-group checkbox-row">
              <input type="checkbox" id="paid" checked={form.paid} onChange={e => setForm({...form, paid: e.target.checked})} />
              <label htmlFor="paid">చెల్లించారు (Paid)</label>
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
