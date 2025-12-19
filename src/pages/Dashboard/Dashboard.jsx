import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  console.log("USER IN DASHBOARD =>", user);

  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
