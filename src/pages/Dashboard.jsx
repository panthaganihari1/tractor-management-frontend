import { useEffect, useState } from 'react'
import { getSummary } from '../services/financeService'
import { getAllBookings } from '../services/bookingService'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, totalDue: 0, totalAcres: 0, netProfit: 0 })
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [summaryRes, bookingsRes] = await Promise.all([getSummary(), getAllBookings()])
      setStats(summaryRes.data)
      setBookings(bookingsRes.data)
    } catch {
      alert('డాష్‌బోర్డ్ డేటా లోడ్ చేయడంలో సమస్య')
    } finally {
      setLoading(false)
    }
  }

  const monthlyData = [
    { name: 'అక్టో', income: 18000, expense: 8000 },
    { name: 'నవం', income: 22000, expense: 9500 },
    { name: 'డిసం', income: 19000, expense: 7000 },
    { name: 'జన', income: stats.totalIncome, expense: stats.totalExpense },
  ]

  const nagaliCounts = bookings.reduce((acc, b) => {
    acc[b.nagaliType] = (acc[b.nagaliType] || 0) + 1
    return acc
  }, {})

  const colors = ['#2d7a3a', '#f59e0b', '#8b5e3c', '#3b82f6']
  const nagaliPieData = Object.entries(nagaliCounts).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }))

  const unpaidBookings = bookings.filter(b => !b.paid)

  if (loading) return <div className="loading-state">లోడ్ అవుతోంది...</div>

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">మొత్తం ఆదాయం</div>
          <div className="stat-value">₹{stats.totalIncome.toLocaleString('te-IN')}</div>
          <div className="stat-sub">Total income this month</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">మొత్తం ఖర్చు</div>
          <div className="stat-value">₹{stats.totalExpense.toLocaleString('te-IN')}</div>
          <div className="stat-sub">Total expenses</div>
        </div>
        <div className="stat-card earth">
          <div className="stat-label">నికర లాభం</div>
          <div className="stat-value" style={{ color: stats.netProfit >= 0 ? '#1a5c2a' : '#dc2626' }}>
            ₹{stats.netProfit.toLocaleString('te-IN')}
          </div>
          <div className="stat-sub">Net profit</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">బకాయి మొత్తం</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>₹{stats.totalDue.toLocaleString('te-IN')}</div>
          <div className="stat-sub">Pending dues</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">మొత్తం ఎకరాలు</div>
          <div className="stat-value">{stats.totalAcres}</div>
          <div className="stat-sub">Acres worked this month</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3 className="card-title">📈 నెలవారీ ఆదాయ-వ్యయాలు</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={24}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Noto Sans Telugu' }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString('te-IN')}`} />
              <Bar dataKey="income" fill="#2d7a3a" name="ఆదాయం" radius={[4,4,0,0]} />
              <Bar dataKey="expense" fill="#f59e0b" name="ఖర్చు" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">⚙️ నాగలి రకాల వినియోగం</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={nagaliPieData} dataKey="value" cx="50%" cy="50%" outerRadius={72} label={({name}) => name}>
                {nagaliPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h3 className="card-title card-title--danger">⚠️ బకాయిలు (Pending Dues)</h3>
          <span className="badge badge-red">{unpaidBookings.length} రైతులు</span>
        </div>
        {unpaidBookings.length === 0 ? (
          <p className="text-muted">అన్నీ చెల్లించారు ✅</p>
        ) : (
          <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>రైతు పేరు</th>
                <th>గ్రామం</th>
                <th>నాగలి రకం</th>
                <th>ఎకరాలు</th>
                <th>బకాయి</th>
              </tr>
            </thead>
            <tbody>
              {unpaidBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.farmer}</td>
                  <td>{b.village}</td>
                  <td><span className="badge badge-amber">{b.nagaliType}</span></td>
                  <td>{b.acres} ఎకరాలు</td>
                  <td style={{ fontWeight: 700, color: '#dc2626' }}>₹{b.totalAmount.toLocaleString('te-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
