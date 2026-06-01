import { useState, useEffect } from 'react'
import { Download, TrendingUp, Package, Monitor, ShoppingCart, RefreshCw } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../api'

const fmt = n => `₨ ${(n || 0).toLocaleString()}`

const today = () => new Date().toISOString().split('T')[0]
const daysAgo = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export default function Reports() {
  const [tab, setTab] = useState('sales')
  const [salesData, setSalesData] = useState(null)
  const [invData, setInvData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState(daysAgo(30))
  const [to, setTo] = useState(today())
  const [groupBy, setGroupBy] = useState('day')

  const loadSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reports/sales', { params: { from, to, groupBy } })
      setSalesData(data)
    } finally { setLoading(false) }
  }

  const loadInventory = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reports/inventory')
      setInvData(data)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (tab === 'sales') loadSales()
    else if (tab === 'inventory') loadInventory()
  }, [tab, from, to, groupBy])

  // Merge online + POS data for combined chart
  const combinedChart = (() => {
    if (!salesData) return []
    const map = {}
    salesData.onlineSales.forEach(d => { map[d._id] = { date: d._id, online: d.revenue, onlineOrders: d.orders } })
    salesData.posSales.forEach(d => {
      if (!map[d._id]) map[d._id] = { date: d._id, online: 0, onlineOrders: 0 }
      map[d._id].pos = d.revenue
      map[d._id].posOrders = d.sales
    })
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
  })()

  const totalOnline = salesData?.onlineSales.reduce((s, d) => s + d.revenue, 0) || 0
  const totalPOS = salesData?.posSales.reduce((s, d) => s + d.revenue, 0) || 0

  const exportCSV = (data, filename) => {
    if (!data || data.length === 0) return alert('No data to export')
    const keys = Object.keys(data[0])
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  }

  const TABS = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'pos', label: 'POS vs Online', icon: Monitor },
  ]

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>Reports & Analytics</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === id ? 'var(--green)' : 'var(--muted)',
              fontWeight: 700, fontSize: 13,
              borderBottom: tab === id ? '2px solid var(--green)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {(tab === 'sales' || tab === 'pos') && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ color: 'var(--muted)', fontSize: 11, display: 'block', marginBottom: 4 }}>From</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="form-input" style={{ width: 150 }} />
            </div>
            <div>
              <label style={{ color: 'var(--muted)', fontSize: 11, display: 'block', marginBottom: 4 }}>To</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} className="form-input" style={{ width: 150 }} />
            </div>
            <div>
              <label style={{ color: 'var(--muted)', fontSize: 11, display: 'block', marginBottom: 4 }}>Group By</label>
              <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="form-input" style={{ width: 120 }}>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>
            <button onClick={loadSales} className="btn btn-ghost btn-sm" style={{ marginTop: 18 }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => exportCSV(combinedChart, 'sales-report.csv')} className="btn btn-ghost btn-sm" style={{ marginTop: 18 }}>
              <Download size={13} /> Export CSV
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" style={{ width: 36, height: 36 }} /></div>
          ) : (
            <>
              {tab === 'sales' && (
                <>
                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'Online Revenue', value: fmt(totalOnline), color: '#60a5fa', icon: ShoppingCart },
                      { label: 'POS Revenue', value: fmt(totalPOS), color: '#c084fc', icon: Monitor },
                      { label: 'Total Revenue', value: fmt(totalOnline + totalPOS), color: '#4ade80', icon: TrendingUp },
                      { label: 'Online Orders', value: salesData?.onlineSales.reduce((s, d) => s + d.orders, 0) || 0, color: '#fbbf24', icon: ShoppingCart },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                            <Icon size={16} />
                          </div>
                          <p style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</p>
                        </div>
                        <p style={{ color: 'var(--text)', fontSize: 22, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Chart */}
                  <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={combinedChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" />
                        <XAxis dataKey="date" tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} />
                        <YAxis tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₨${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ background: '#132a18', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, color: '#f0fdf4' }}
                          formatter={(v, name) => [`₨ ${v.toLocaleString()}`, name === 'online' ? 'Online' : 'POS']} />
                        <Legend formatter={v => v === 'online' ? 'Online' : 'POS'} />
                        <Line type="monotone" dataKey="online" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 3 }} />
                        <Line type="monotone" dataKey="pos" stroke="#c084fc" strokeWidth={2.5} dot={{ fill: '#c084fc', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Data Table */}
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700 }}>Sales Breakdown</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Date</th><th>Online Orders</th><th>Online Revenue</th><th>POS Sales</th><th>POS Revenue</th><th>Total</th></tr></thead>
                        <tbody>
                          {combinedChart.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>No data for selected period</td></tr>
                          ) : combinedChart.map(row => (
                            <tr key={row.date}>
                              <td style={{ color: 'var(--text)', fontWeight: 600 }}>{row.date}</td>
                              <td>{row.onlineOrders || 0}</td>
                              <td style={{ color: '#60a5fa', fontWeight: 700 }}>{fmt(row.online || 0)}</td>
                              <td>{row.posOrders || 0}</td>
                              <td style={{ color: '#c084fc', fontWeight: 700 }}>{fmt(row.pos || 0)}</td>
                              <td style={{ color: 'var(--green)', fontWeight: 800 }}>{fmt((row.online || 0) + (row.pos || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {tab === 'pos' && (
                <>
                  {/* POS vs Online Comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                    <div className="card">
                      <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Online Sales</h3>
                      <p style={{ color: '#60a5fa', fontSize: 28, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{fmt(totalOnline)}</p>
                      <p style={{ color: 'var(--muted)', fontSize: 12 }}>{salesData?.onlineSales.reduce((s, d) => s + d.orders, 0) || 0} orders</p>
                    </div>
                    <div className="card">
                      <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>POS Sales</h3>
                      <p style={{ color: '#c084fc', fontSize: 28, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{fmt(totalPOS)}</p>
                      <p style={{ color: 'var(--muted)', fontSize: 12 }}>{salesData?.posSales.reduce((s, d) => s + d.sales, 0) || 0} transactions</p>
                    </div>
                  </div>

                  <div className="card">
                    <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>POS vs Online Comparison</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={combinedChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" />
                        <XAxis dataKey="date" tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} />
                        <YAxis tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₨${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ background: '#132a18', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, color: '#f0fdf4' }}
                          formatter={(v, name) => [`₨ ${v.toLocaleString()}`, name === 'online' ? 'Online' : 'POS']} />
                        <Legend formatter={v => v === 'online' ? 'Online' : 'POS'} />
                        <Bar dataKey="online" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pos" fill="#c084fc" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Inventory Report */}
      {tab === 'inventory' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={() => exportCSV(invData?.products, 'inventory-report.csv')} className="btn btn-ghost btn-sm">
              <Download size={13} /> Export CSV
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" style={{ width: 36, height: 36 }} /></div>
          ) : invData && (
            <>
              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total Products', value: invData.totalProducts, color: '#4ade80' },
                  { label: 'Total Stock Value', value: fmt(invData.totalValue), color: '#60a5fa' },
                  { label: 'Low Stock Items', value: invData.lowStock.length, color: '#fbbf24' },
                  { label: 'Out of Stock', value: invData.outOfStock.length, color: '#f87171' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card">
                    <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>{label}</p>
                    <p style={{ color, fontSize: 24, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Low Stock Alert */}
              {invData.lowStock.length > 0 && (
                <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(251,191,36,0.3)' }}>
                  <h3 style={{ color: '#fbbf24', fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> Low Stock Products</h3>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Product</th><th>Series</th><th>SKU</th><th>Stock</th><th>Threshold</th></tr></thead>
                      <tbody>
                        {invData.lowStock.map(p => (
                          <tr key={p._id}>
                            <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                            <td>{p.series}</td>
                            <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.sku || '—'}</td>
                            <td><span style={{ color: p.stock === 0 ? 'var(--red)' : '#fbbf24', fontWeight: 800 }}>{p.stock}</span></td>
                            <td style={{ color: 'var(--muted)' }}>{p.lowStockAlert}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Full Inventory Table */}
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700 }}>Complete Inventory</h3>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Product</th><th>Series</th><th>Year</th><th>Price</th><th>Cost</th><th>Stock</th><th>Stock Value</th><th>Status</th></tr></thead>
                    <tbody>
                      {invData.products.map(p => (
                        <tr key={p._id}>
                          <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                          <td>{p.series}</td>
                          <td style={{ color: 'var(--muted)' }}>{p.year}</td>
                          <td style={{ color: 'var(--text)', fontWeight: 700 }}>₨ {p.price.toLocaleString()}</td>
                          <td style={{ color: 'var(--muted)' }}>₨ {p.costPrice.toLocaleString()}</td>
                          <td style={{ fontWeight: 800, color: p.stock === 0 ? 'var(--red)' : p.stock <= p.lowStockAlert ? '#fbbf24' : 'var(--green)' }}>{p.stock}</td>
                          <td style={{ color: '#60a5fa', fontWeight: 700 }}>₨ {(p.stock * p.costPrice).toLocaleString()}</td>
                          <td>
                            {p.stock === 0
                              ? <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>Out</span>
                              : p.stock <= p.lowStockAlert
                                ? <span className="badge" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>Low</span>
                                : <span className="badge" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--green)' }}>OK</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
