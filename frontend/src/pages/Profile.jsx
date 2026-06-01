import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { User, Mail, Phone, MapPin, Lock, Save, Package, LogOut, Eye, EyeOff } from "lucide-react";

const S = {
  page:  { minHeight:"100vh", background:"#0b1a0e", padding:"40px 24px" },
  wrap:  { maxWidth:760, margin:"0 auto" },
  card:  { background:"#0f2214", border:"1px solid rgba(74,222,128,0.12)", borderRadius:20, padding:"24px 28px", marginBottom:20 },
  label: { display:"block", fontSize:11, fontWeight:700, color:"#86efac", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" },
  input: { width:"100%", background:"#0b1a0e", border:"1px solid rgba(74,222,128,0.15)", borderRadius:12, padding:"12px 16px", color:"#f0fdf4", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s" },
};

export default function Profile() {
  const { user, logoutUser, updateUser, loading: authLoading } = useUser();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ name:"", phone:"", address:"", city:"" });
  const [pwForm,  setPwForm]  = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [saving,  setSaving]  = useState(false);
  const [pwSaving,setPwSaving]= useState(false);
  const [msg,     setMsg]     = useState(null);
  const [pwMsg,   setPwMsg]   = useState(null);
  const [showPw,  setShowPw]  = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { state: { from: "/profile" } });
    if (user) setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "", city: user.city || "" });
  }, [user, authLoading]);

  const inputStyle = (name) => ({
    ...S.input,
    borderColor: focused === name ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.15)",
    boxShadow:   focused === name ? "0 0 0 3px rgba(74,222,128,0.08)" : "none",
  });

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      const token = localStorage.getItem("hw_user_token");
      const { data } = await axios.put("/api/user/profile", form, { headers: { Authorization: `Bearer ${token}` } });
      updateUser(data);
      setMsg({ type:"success", text:"Profile updated successfully!" });
    } catch (err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Error saving" });
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault(); setPwSaving(true); setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwMsg({ type:"error", text:"Passwords do not match" });
    try {
      const token = localStorage.getItem("hw_user_token");
      await axios.put("/api/user/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      setPwMsg({ type:"success", text:"Password changed successfully!" });
      setPwForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      setPwMsg({ type:"error", text: err.response?.data?.message || "Error changing password" });
    } finally { setPwSaving(false); }
  };

  const handleLogout = () => { logoutUser(); navigate("/"); };

  if (authLoading || !user) return (
    <div style={{ minHeight:"100vh", background:"#0b1a0e", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:36, height:36, border:"3px solid rgba(74,222,128,0.2)", borderTop:"3px solid #4ade80", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", overflow:"hidden", background:"linear-gradient(135deg,#16a34a,#4ade80)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {user.profilePicture
                ? <img src={user.profilePicture} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <span style={{ color:"#000", fontWeight:900, fontSize:20 }}>{user.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div>
              <h1 style={{ color:"#f0fdf4", fontWeight:800, fontSize:20, fontFamily:"'Rajdhani',sans-serif" }}>{user.name}</h1>
              <p style={{ color:"rgba(134,239,172,0.5)", fontSize:12 }}>{user.email}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Link to="/my-orders" style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:11, color:"#4ade80", textDecoration:"none", fontWeight:600, fontSize:13 }}>
              <Package size={14}/> My Orders
            </Link>
            <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:11, color:"#f87171", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
          {[
            { label:"Total Orders", value: user.totalOrders || 0, color:"#4ade80" },
            { label:"Total Spent",  value: `₨ ${(user.totalSpent || 0).toLocaleString()}`, color:"#60a5fa" },
            { label:"Member Since", value: new Date(user.createdAt).toLocaleDateString("en-PK", { month:"short", year:"numeric" }), color:"#c084fc" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...S.card, marginBottom:0, textAlign:"center" }}>
              <p style={{ color:"rgba(134,239,172,0.5)", fontSize:11, marginBottom:6 }}>{label}</p>
              <p style={{ color, fontWeight:900, fontSize:20, fontFamily:"'Rajdhani',sans-serif" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div style={S.card}>
          <h3 style={{ color:"#f0fdf4", fontWeight:700, fontSize:15, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            <User size={15} style={{ color:"#4ade80" }}/> Edit Profile
          </h3>
          <form onSubmit={saveProfile}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={S.label}>Full Name</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle("name")} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")}/>
              </div>
              <div>
                <label style={S.label}>Phone</label>
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+92 300 0000000" style={inputStyle("phone")} onFocus={()=>setFocused("phone")} onBlur={()=>setFocused("")}/>
              </div>
              <div>
                <label style={S.label}>City</label>
                <input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="Karachi" style={inputStyle("city")} onFocus={()=>setFocused("city")} onBlur={()=>setFocused("")}/>
              </div>
              <div>
                <label style={S.label}>Address</label>
                <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Street, Area" style={inputStyle("address")} onFocus={()=>setFocused("address")} onBlur={()=>setFocused("")}/>
              </div>
            </div>
            {msg && (
              <div style={{ marginTop:14, padding:"10px 14px", borderRadius:10, fontSize:13, fontWeight:600, background: msg.type==="success"?"rgba(74,222,128,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${msg.type==="success"?"rgba(74,222,128,0.2)":"rgba(239,68,68,0.2)"}`, color: msg.type==="success"?"#4ade80":"#f87171" }}>
                {msg.text}
              </div>
            )}
            <button type="submit" disabled={saving} style={{ marginTop:16, display:"flex", alignItems:"center", gap:7, padding:"11px 22px", background:"linear-gradient(135deg,#16a34a,#4ade80)", border:"none", borderRadius:11, color:"#000", fontWeight:700, fontSize:13, cursor: saving?"not-allowed":"pointer", opacity: saving?0.7:1 }}>
              {saving ? <span style={{ width:14, height:14, border:"2px solid rgba(0,0,0,0.2)", borderTop:"2px solid #000", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <Save size={14}/>}
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password — only for email users */}
        {user.password !== undefined && !user.googleId && (
          <div style={S.card}>
            <h3 style={{ color:"#f0fdf4", fontWeight:700, fontSize:15, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
              <Lock size={15} style={{ color:"#4ade80" }}/> Change Password
            </h3>
            <form onSubmit={changePassword}>
              <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:400 }}>
                {["currentPassword","newPassword","confirmPassword"].map((field, i) => (
                  <div key={field}>
                    <label style={S.label}>{field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}</label>
                    <div style={{ position:"relative" }}>
                      <input type={showPw?"text":"password"} value={pwForm[field]} onChange={e=>setPwForm(f=>({...f,[field]:e.target.value}))} required style={{ ...inputStyle(field), paddingRight:42 }} onFocus={()=>setFocused(field)} onBlur={()=>setFocused("")}/>
                      {i === 0 && (
                        <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(134,239,172,0.4)", cursor:"pointer", display:"flex" }}>
                          {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {pwMsg && (
                <div style={{ marginTop:14, padding:"10px 14px", borderRadius:10, fontSize:13, fontWeight:600, background: pwMsg.type==="success"?"rgba(74,222,128,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${pwMsg.type==="success"?"rgba(74,222,128,0.2)":"rgba(239,68,68,0.2)"}`, color: pwMsg.type==="success"?"#4ade80":"#f87171" }}>
                  {pwMsg.text}
                </div>
              )}
              <button type="submit" disabled={pwSaving} style={{ marginTop:16, display:"flex", alignItems:"center", gap:7, padding:"11px 22px", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:11, color:"#4ade80", fontWeight:700, fontSize:13, cursor: pwSaving?"not-allowed":"pointer" }}>
                {pwSaving ? <span style={{ width:14, height:14, border:"2px solid rgba(74,222,128,0.2)", borderTop:"2px solid #4ade80", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <Lock size={14}/>}
                Change Password
              </button>
            </form>
          </div>
        )}

        {user.googleId && (
          <div style={{ ...S.card, display:"flex", alignItems:"center", gap:12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <p style={{ color:"rgba(134,239,172,0.6)", fontSize:13 }}>Signed in with Google — no password required</p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
