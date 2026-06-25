import { useEffect, useState } from 'react'
import { getSummary, getExpenses, addExpense, getIncomeRecords } from '../services/financeService'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const expenseTypes = ['డీజిల్', 'Maintenance', 'Driver జీతం', 'Spare parts', 'ఇతర']

export default function FinancePage() {
  const [expenses, setExpenses] = useState([])
  const [incomeRecords, setIncomeRecords] = useState([])
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [form, setForm] = useState({ type: 'డీజిల్', amount: '', date: new Date().toISOString().split('T')[0], note: '' })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [summaryRes, expensesRes, incomeRes] = await Promise.all([
        getSummary(),
        getExpenses(),
        getIncomeRecords(),
      ])
      setSummary(summaryRes.data)
      setExpenses(expensesRes.data)
      setIncomeRecords(incomeRes.data)
    } catch {
      alert('ఫైనాన్స్ డేటా లోడ్ చేయడంలో సమస్య')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!form.amount) return alert('మొత్తం పూరించండి')
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      const { data } = await addExpense(payload)
      setExpenses([data, ...expenses])
      const { data: newSummary } = await getSummary()
      setSummary(newSummary)
      setShowModal(false)
      setForm({ type: 'డీజిల్', amount: '', date: new Date().toISOString().split('T')[0], note: '' })
    } catch {
      alert('ఖర్చు సేవ్ చేయడంలో సమస్య')
    }
  }

  const totalIncome = summary.totalIncome
  const totalExpense = summary.totalExpense
  const netProfit = summary.netProfit

  const byType = expenseTypes.map(t => ({
    type: t,
    amount: expenses.filter(e => e.type === t).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.amount > 0)

  const trendData = [
    { name: 'వారం 1', income: 8400, expense: 3500 },
    { name: 'వారం 2', income: 5500, expense: 6300 },
    { name: 'వారం 3', income: 7200, expense: 4800 },
    { name: 'వారం 4', income: totalIncome - 21100, expense: totalExpense - 14600 },
  ]

  const tabs = [
    { id: 'summary', label: 'సారాంశం' },
    { id: 'expenses', label: 'ఖర్చులు' },
    { id: 'income', label: 'ఆదాయం' },
  ]

  if (loading) return <div className="loading-state">లోడ్ అవుతోంది...</div>

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">మొత్తం ఆదాయం</div>
          <div className="stat-value">₹{totalIncome.toLocaleString('te-IN')}</div>
          <div className="stat-sub">Tractor అద్దె నుంచి</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">మొత్తం ఖర్చు</div>
          <div className="stat-value">₹{totalExpense.toLocaleString('te-IN')}</div>
          <div className="stat-sub">{expenses.length} ఖర్చు రికార్డులు</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: netProfit >= 0 ? '#2d7a3a' : '#dc2626' }}>
          <div className="stat-label">నికర లాభం</div>
          <div className="stat-value" style={{ color: netProfit >= 0 ? '#1a5c2a' : '#dc2626' }}>
            {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString('te-IN')}
          </div>
          <div className="stat-sub">{netProfit >= 0 ? '✅ లాభంలో ఉన్నారు' : '⚠️ నష్టంలో ఉన్నారు'}</div>
        </div>
      </div>

      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`tab-bar__btn ${activeTab === t.id ? 'tab-bar__btn--active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title">📈 వారంవారీ ట్రెండ్</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Noto Sans Telugu' }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip formatter={v => `₹${v.toLocaleString('te-IN')}`} />
                <Line type="monotone" dataKey="income" stroke="#2d7a3a" strokeWidth={2.5} dot={{ r: 4 }} name="ఆదాయం" />
                <Line type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} name="ఖర్చు" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="card-title">💸 రకాల వారీ ఖర్చులు</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {byType.map(item => (
                <div key={item.type} className="expense-bar-row">
                  <div className="expense-bar-label">{item.type}</div>
                  <div className="expense-bar-track">
                    <div className="expense-bar-fill" style={{ width: `${(item.amount / totalExpense * 100)}%` }} />
                  </div>
                  <div className="expense-bar-value">₹{item.amount.toLocaleString('te-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="card">
          <div className="page-header">
            <h2>💸 ఖర్చుల వివరాలు</h2>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ కొత్త ఖర్చు</button>
          </div>
          <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>రకం</th>
                <th>మొత్తం</th>
                <th>తేదీ</th>
                <th>గమనిక</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id}>
                  <td><span className="badge badge-amber">{e.type}</span></td>
                  <td className="text-danger">₹{e.amount.toLocaleString('te-IN')}</td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>{e.date}</td>
                  <td style={{ fontSize: 13, color: '#4b5563' }}>{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === 'income' && (
        <div className="card">
          <div className="page-header">
            <h2>💰 ఆదాయ వివరాలు</h2>
          </div>
          <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>రైతు పేరు</th>
                <th>నాగలి రకం</th>
                <th>ఎకరాలు</th>
                <th>మొత్తం</th>
                <th>తేదీ</th>
                <th>స్థితి</th>
              </tr>
            </thead>
            <tbody>
              {incomeRecords.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.farmer}</td>
                  <td><span className="badge badge-green">{b.nagaliType}</span></td>
                  <td>{b.acres}</td>
                  <td className="text-success">₹{b.totalAmount.toLocaleString('te-IN')}</td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>{b.date}</td>
                  <td><span className={`badge ${b.paid ? 'badge-green' : 'badge-red'}`}>{b.paid ? 'చెల్లించారు' : 'బకాయి'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>💸 కొత్త ఖర్చు నమోదు</h3>
            <div className="form-group">
              <label>ఖర్చు రకం</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {expenseTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>మొత్తం (₹) *</label>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>తేదీ</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>గమనిక</label>
              <input placeholder="వివరాలు (ఐచ్ఛికం)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
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
