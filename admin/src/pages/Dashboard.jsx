import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, BarChart3, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import api from '../api'

const fmt = (n) => `₨ ${(n || 0).toLocaleString()}`

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      api.get('/reports/dashboard').then(r => setData(r.data)).finally(() => setLoading(false))
    }

    fetchData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" style={{ width: 36, height: 36 }} /></div>
  if (!data) return <p style={{ color: 'var(--red)' }}>Failed to load dashboard</p>

  const stats = [
    { label: "Today's Revenue", value: fmt(data.today.revenue), icon: DollarSign, color: '#4ade80', sub: `${data.today.orders} orders + ${data.today.pos} POS` },
    { label: "This Week", value: fmt(data.week.revenue), icon: TrendingUp, color: '#60a5fa', sub: `${data.week.orders} orders` },
    { label: "This Month", value: fmt(data.month.revenue), icon: BarChart3, color: '#c084fc', sub: `${data.month.orders} orders` },
    { label: "Low Stock Items", value: data.lowStockCount, icon: AlertTriangle, color: '#fbbf24', sub: `of ${data.totalProducts} products` },
  ]

  const statusColor = { pending: '#fbbf24', processing: '#60a5fa', shipped: '#c084fc', delivered: '#4ade80', cancelled: '#f87171' }

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 22 }}>Dashboard</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={19} />
              </div>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>{label}</p>
            <p style={{ color: 'var(--text)', fontSize: 24, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{value}</p>
            <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div className="card">
          <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.1)" />
              <XAxis dataKey="_id" tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₨${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#132a18', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, color: '#f0fdf4' }} formatter={v => [`₨ ${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2.5} dot={{ fill: '#4ade80', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Top Selling Products</h3>
          {data.topProducts.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No sales data yet</p>
          ) : (
            <div>
              {data.topProducts.map((p, i) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', color: 'var(--green)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <span style={{ color: 'var(--sub)', fontSize: 13 }}>{p.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700 }}>{p.totalSold} sold</p>
                    <p style={{ color: 'var(--muted)', fontSize: 11 }}>{fmt(p.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div className="card">
          <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Recent Orders</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentOrders.map(o => (
                  <tr key={o._id}>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>{o.orderNumber}</td>
                    <td>{o.customer.name}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 700 }}>{fmt(o.total)}</td>
                    <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: '#fbbf24' }} /> Low Stock Alerts
          </h3>
          {data.lowStockCount === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} style={{ color: 'var(--green)' }} /> All products well stocked</p>
          ) : (
            <p style={{ color: '#fbbf24', fontSize: 13 }}>{data.lowStockCount} product(s) need restocking. Go to Inventory → Low Stock filter.</p>
          )}
        </div>
      </div>
    </div>
  )
}
