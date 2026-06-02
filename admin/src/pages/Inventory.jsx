import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Edit, Trash2, X, Upload, Download, History, AlertTriangle, Package, DollarSign, FileText, Tag, Target, Calendar, Bookmark, BarChart2, Banknote, TrendingDown, Hash, Link2 } from 'lucide-react'
// ImageIcon aliased to avoid conflict with HTML element
import { Image as ImageIcon } from 'lucide-react'
import api from '../api'

const SERIES = ['Mountain Bikes', 'Road Bikes', 'Gravel Bikes', 'Electric Bikes', "Kid's Bikes", 'Parts', 'Accessories', 'Apparel', 'Pre-Owned']

const CATEGORIES = ['MOUNTAIN BIKES', 'ROAD BIKES', 'GRAVEL BIKES', 'ELECTRIC BIKES', "KID'S BIKE", 'PARTS', 'ACCESSORIES', 'APPAREL', 'SALE', 'PRE-OWNED']

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', series: '', stockStatus: '', minPrice: '', maxPrice: '' })
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [stockLogs, setStockLogs] = useState([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [importing, setImporting] = useState(false)
  const [stats, setStats] = useState({})
  const fileRef = useRef()
  const importRef = useRef()

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 100, ...filters }
      const { data } = await api.get('/products', { params })
      setProducts(data.products); setTotal(data.total); setPages(data.pages); setPage(p)

      // Calculate stats
      const inStock = data.products.filter(p => p.stock > 0).length
      const lowStock = data.products.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert).length
      const outOfStock = data.products.filter(p => p.stock === 0).length
      const totalValue = data.products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0)

      setStats({
        total: data.total,
        inStock,
        lowStock,
        outOfStock,
        totalValue
      })
    } finally { setLoading(false) }
  }

  useEffect(() => {
    load(1)

    // Auto-refresh every 20 seconds
    const interval = setInterval(() => load(page), 20000)

    return () => clearInterval(interval)
  }, [filters])

  // Disable body scroll when modal is open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modal])

  const openAdd = () => {
    setForm({ name: '', series: 'Mountain Bikes', year: new Date().getFullYear(), sku: '', barcode: '', price: '', salePrice: '', costPrice: '', stock: '', lowStockAlert: 5, description: '', category: 'MOUNTAIN BIKES' })
    setModal('add')
  }

  const openEdit = (p) => {
    setForm({ ...p, price: p.price, salePrice: p.salePrice, costPrice: p.costPrice, stock: p.stock })
    setSelected(p)
    setModal('edit')
  }

  const openLogs = async (p) => {
    setSelected(p)
    const { data } = await api.get(`/products/${p._id}/stock-logs`)
    setStockLogs(data)
    setModal('logs')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    load(page)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v) })
      if (form._imageFile) fd.append('image', form._imageFile)
      if (modal === 'edit') await api.put(`/products/${selected._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setModal(null); load(page)
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
    finally { setSaving(false) }
  }

  const handleExport = async () => {
    const { data } = await api.get('/products/bulk/export')
    const csv = [
      'name,series,year,sku,barcode,price,salePrice,costPrice,stock,lowStockAlert,description',
      ...data.map(p => `"${p.name}","${p.series}",${p.year},"${p.sku || ''}","${p.barcode || ''}",${p.price},${p.salePrice},${p.costPrice},${p.stock},${p.lowStockAlert},"${p.description || ''}"`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click()
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const products = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
        const obj = {}
        headers.forEach((h, i) => {
          const v = (vals[i] || '').replace(/"/g, '').trim()
          obj[h] = ['price', 'salePrice', 'costPrice', 'stock', 'lowStockAlert', 'year'].includes(h) ? +v : v
        })
        return obj
      }).filter(p => p.name)
      if (products.length === 0) return alert('No valid products found in CSV')
      const { data } = await api.post('/products/bulk/import', { products })
      alert(`✅ ${data.imported} products imported successfully!`)
      load(1)
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed. Check CSV format.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const downloadTemplate = () => {
    const csv = 'name,series,year,sku,barcode,price,salePrice,costPrice,stock,lowStockAlert,description\n"Hot Wheels Example","Classics",2024,"HW-100","1234567890100",1500,1200,800,10,5,"Sample description"'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'import-template.csv'; a.click()
  }

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <div className="fade-up">
        {/* Header */}
        <div className="inv-header">
          <div>
            <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Inventory</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Total: <b style={{ color: 'var(--green)' }}>{total}</b> products</p>
          </div>
          <div className="inv-header-actions">
            <button onClick={handleExport} className="btn btn-ghost btn-sm"><Download size={14} /> Export CSV</button>
            <input ref={importRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
            <button onClick={() => importRef.current.click()} disabled={importing} className="btn btn-ghost btn-sm">
              <Upload size={14} /> {importing ? 'Importing...' : 'Import CSV'}
            </button>
            <button onClick={downloadTemplate} className="btn btn-ghost btn-sm" title="Download CSV template">
              <Download size={14} /> Template
            </button>
            <button onClick={openAdd} className="btn btn-primary"><Plus size={15} /> Add Product</button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--green)', marginBottom: '8px' }}>
              {stats.total || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500' }}>Total Products</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--green)', marginBottom: '8px' }}>
              {stats.inStock || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500' }}>In Stock</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--yellow)', marginBottom: '8px' }}>
              {stats.lowStock || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500' }}>Low Stock</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--red)', marginBottom: '8px' }}>
              {stats.outOfStock || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500' }}>Out of Stock</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '8px' }}>
              ₨ {(stats.totalValue || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500' }}>Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="inv-filters">
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Search name, SKU, barcode..."
              className="form-input" style={{ paddingLeft: 36 }} />
          </div>
          <select value={filters.series} onChange={e => setFilters(f => ({ ...f, series: e.target.value }))} className="form-input inv-filter-select">
            <option value="">All Series</option>
            {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.stockStatus} onChange={e => setFilters(f => ({ ...f, stockStatus: e.target.value }))} className="form-input inv-filter-select-sm">
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <input type="number" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} placeholder="Min Price" className="form-input inv-filter-price" />
          <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="Max Price" className="form-input inv-filter-price" />
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Product</th><th>Category</th><th>Series</th><th>SKU</th>
                <th>Price</th><th>Sale Price</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.image && <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: 'var(--surface)' }} onError={e => e.target.style.display = 'none'} />}
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category || p.series}</td>
                    <td>{p.series}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.sku || '—'}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>₨ {p.price.toLocaleString()}</td>
                    <td style={{ color: 'var(--green)' }}>₨ {p.salePrice.toLocaleString()}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--red)' : p.isLowStock ? '#fbbf24' : 'var(--green)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      {p.stock === 0 ? <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>Out of Stock</span>
                        : p.isLowStock ? <span className="badge" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}><AlertTriangle size={10} style={{ marginRight: 3 }} />Low Stock</span>
                          : <span className="badge" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--green)' }}>In Stock</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm"><Edit size={13} /></button>
                        <button onClick={() => openLogs(p)} className="btn btn-ghost btn-sm" title="Stock History"><History size={13} /></button>
                        <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination" style={{ padding: '12px 20px' }}>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i + 1} onClick={() => load(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20, backdropFilter: 'blur(8px)' }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700, background: 'var(--raised)', border: '1px solid var(--borderMd)', borderRadius: 20, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
          >
            <div className="modal-header" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(74,222,128,0.05), transparent)' }}>
              <div>
                <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                  {modal === 'edit' ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 12 }}>{modal === 'edit' ? 'Update product details below' : 'Fill in the details to add a new product'}</p>
              </div>
              <button onClick={() => setModal(null)} className="btn btn-danger btn-sm" style={{ borderRadius: 8, padding: 8 }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ padding: '28px', maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>

                {/* Basic Info Section */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <Package size={16} style={{ color: 'var(--green)' }} />
                    <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={13} style={{ color: 'var(--green)' }} /> Product Name <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <input value={form.name || ''} onChange={e => inp('name', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="Enter product name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Target size={13} style={{ color: 'var(--green)' }} /> Series <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <select value={form.series || ''} onChange={e => inp('series', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px' }}>
                        {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={13} style={{ color: 'var(--green)' }} /> Category <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <select value={form.category || 'MOUNTAIN BIKES'} onChange={e => inp('category', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px' }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} style={{ color: 'var(--green)' }} /> Year <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <input type="number" value={form.year || ''} onChange={e => inp('year', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="2024" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bookmark size={13} style={{ color: 'var(--green)' }} /> SKU
                      </label>
                      <input value={form.sku || ''} onChange={e => inp('sku', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="HW-001" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <BarChart2 size={13} style={{ color: 'var(--green)' }} /> Barcode
                      </label>
                      <input value={form.barcode || ''} onChange={e => inp('barcode', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="1234567890100" />
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <DollarSign size={16} style={{ color: 'var(--green)' }} />
                    <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Banknote size={13} style={{ color: 'var(--green)' }} /> Price (PKR) <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <input type="number" value={form.price || ''} onChange={e => inp('price', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px', borderColor: 'var(--green)' }} placeholder="1500" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={13} style={{ color: 'var(--green)' }} /> Sale Price
                      </label>
                      <input type="number" value={form.salePrice || ''} onChange={e => inp('salePrice', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="1200" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingDown size={13} style={{ color: 'var(--green)' }} /> Cost Price
                      </label>
                      <input type="number" value={form.costPrice || ''} onChange={e => inp('costPrice', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="800" />
                    </div>
                  </div>
                </div>

                {/* Stock Section */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <Package size={16} style={{ color: 'var(--green)' }} />
                    <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13 }}>🔢</span> Stock Quantity <span style={{ color: 'var(--red)' }}>*</span>
                      </label>
                      <input type="number" value={form.stock || ''} onChange={e => inp('stock', e.target.value)} required className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="10" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={13} style={{ color: 'var(--green)' }} /> Low Stock Alert
                      </label>
                      <input type="number" value={form.lowStockAlert || 5} onChange={e => inp('lowStockAlert', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="5" />
                    </div>
                    {modal === 'edit' && (
                      <div className="form-group" style={{ gridColumn: '1/-1' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FileText size={13} style={{ color: 'var(--green)' }} /> Stock Change Note
                        </label>
                        <input value={form.stockNote || ''} onChange={e => inp('stockNote', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="Reason for stock change" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Section */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <FileText size={16} style={{ color: 'var(--green)' }} />
                    <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
                  </div>
                  <div className="form-group">
                    <textarea value={form.description || ''} onChange={e => inp('description', e.target.value)} rows={3} className="form-input" style={{ fontSize: 14, padding: '12px 14px', resize: 'vertical' }} placeholder="Enter product description..." />
                  </div>
                </div>

                {/* Image Section */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <ImageIcon size={16} style={{ color: 'var(--green)' }} />
                    <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Image</h4>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>🔗</span> Image URL
                    </label>
                    <input type="text" value={form.image || ''} onChange={e => inp('image', e.target.value)} className="form-input" style={{ fontSize: 14, padding: '12px 14px' }} placeholder="https://example.com/image.jpg" />

                    <div style={{ marginTop: 12, padding: 16, background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 12, textAlign: 'center' }}>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => inp('_imageFile', e.target.files[0])} />
                      <button type="button" onClick={() => fileRef.current.click()} className="btn btn-ghost" style={{ width: '100%', padding: '12px 20px', borderRadius: 10, border: '1px solid var(--borderMd)' }}>
                        <Upload size={16} style={{ marginRight: 8 }} /> Upload Image
                      </button>
                      {form._imageFile && (
                        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--green)' }}>
                          {form._imageFile.name}
                        </div>
                      )}
                      {form.image && !form._imageFile && (
                        <div style={{ marginTop: 12 }}>
                          <img src={form.image} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} onError={e => e.target.style.display = 'none'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer" style={{ padding: '20px 28px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: 'var(--raised)' }}>
                <button type="button" onClick={() => setModal(null)} className="btn btn-danger" style={{ padding: '10px 24px', borderRadius: 10 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: 10, fontSize: 14 }}>
                  {saving ? <span className="spinner" /> : modal === 'edit' ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Logs Modal */}
      {modal === 'logs' && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20, backdropFilter: 'blur(4px)' }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700, background: 'var(--raised)', border: '1px solid var(--border)', borderRadius: 18, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          >
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                Stock History — {selected?.name}
              </h3>
              <button onClick={() => setModal(null)} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Date</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Admin</th><th>Note</th></tr></thead>
                  <tbody>
                    {stockLogs.map(l => (
                      <tr key={l._id}>
                        <td style={{ fontSize: 12 }}>{new Date(l.createdAt).toLocaleString()}</td>
                        <td><span className="badge" style={{ background: l.type === 'add' ? 'rgba(74,222,128,0.12)' : l.type === 'sale' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)', color: l.type === 'add' ? 'var(--green)' : l.type === 'sale' ? 'var(--red)' : '#fbbf24' }}>{l.type}</span></td>
                        <td style={{ fontWeight: 700 }}>{l.quantity}</td>
                        <td style={{ color: 'var(--muted)' }}>{l.before}</td>
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>{l.after}</td>
                        <td>{l.admin?.name || '—'}</td>
                        <td style={{ color: 'var(--muted)', fontSize: 12 }}>{l.note}</td>
                      </tr>
                    ))}
                    {stockLogs.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 20 }}>No logs found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
