import { useUser } from "../../contexts/context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f4f0",
    fontFamily: "'Georgia', serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
    border: "1px solid #e8e6e1",
    position: "relative",
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #c8a96e, #e8c98a, #c8a96e)",
  },
  avatarWrapper: {
    marginBottom: "1.25rem",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#1a1a1a",
    color: "#c8a96e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "400",
    letterSpacing: "2px",
    margin: "0 auto",
    border: "3px solid #e8e6e1",
  },
  name: {
    fontSize: "22px",
    fontWeight: "400",
    color: "#1a1a1a",
    margin: "0 0 4px",
    letterSpacing: "0.5px",
  },
  role: {
    fontSize: "12px",
    color: "#c8a96e",
    margin: "0 0 1.75rem",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e8e6e1",
    margin: "0 0 1.5rem",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 1.75rem",
    textAlign: "left",
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 0",
    borderBottom: "1px solid #f0ede8",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  infoLabel: {
    fontSize: "11px",
    color: "#aaa89f",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: "13px",
    color: "#1a1a1a",
    fontWeight: "400",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#e8e6e1",
    background: "transparent",
    color: "#1a1a1a",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Helvetica Neue', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  logoutBtnHover: {
    background: "#1a1a1a",
    color: "#c8a96e",
    borderColor: "#1a1a1a",
  },
};



export default function UserProfile() {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  
  const { user, loading, setLogin, setUser } = useUser();
  let initial;
  const userInfo = [
  { label: "Email", value: user?.data.email },
  { label: "Location", value: "Gonaïves" },
  ,
];
  if (!loading) {
    const nameArray = user.data.name.split(" ");

    if (nameArray.length < 2) {
      initial = nameArray[0][0].toUpperCase()
    } else {
      initial = nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
    }
  }

  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem("token");
    setLogin(false)
    navigate("/auth"); // ✅
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.accentBar} />

        <div style={styles.avatarWrapper}>
          <div style={styles.avatar}>{initial}</div>
        </div>

        <p style={styles.name}>{user?.data.name}</p>
        <p style={styles.role}>{user?.data.role}</p>

        <hr style={styles.divider} />

        <ul style={styles.infoList}>
          {userInfo.map(({ label, value }) => (
            <li key={label} style={styles.infoItem}>
              <span style={styles.infoLabel}>{label}</span>
              <span style={styles.infoValue}>{value}</span>
            </li>
          ))}
        </ul>

        <button
          style={
            hovering
              ? { ...styles.logoutBtn, ...styles.logoutBtnHover }
              : styles.logoutBtn
          }
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
      </div>
    </div>
  );
}
