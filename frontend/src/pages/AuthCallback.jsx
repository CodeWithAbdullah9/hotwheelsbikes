import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AuthCallback() {
  const [params]   = useSearchParams();
  const { loginUser } = useUser();
  const navigate   = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const userStr = params.get("user");
    console.log('AuthCallback - full URL:', window.location.href);
    console.log('AuthCallback - token:', token ? 'exists' : 'missing');
    console.log('AuthCallback - userStr:', userStr ? 'exists' : 'missing');
    console.log('AuthCallback - all params:', Object.fromEntries(params));
    
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('AuthCallback - parsed user:', user);
        loginUser(token, user);
        console.log('AuthCallback - login successful, redirecting to home');
        navigate("/", { replace: true });
      } catch (err) {
        console.error('AuthCallback - parse error:', err);
        console.error('AuthCallback - userStr that failed:', userStr);
        navigate("/login?error=callback_failed", { replace: true });
      }
    } else {
      console.error('AuthCallback - missing token or user');
      console.error('AuthCallback - token value:', token);
      console.error('AuthCallback - userStr value:', userStr);
      navigate("/login?error=no_token", { replace: true });
    }
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0b1a0e", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(74,222,128,0.2)", borderTop:"3px solid #4ade80", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <p style={{ color:"#86efac", fontSize:14 }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
