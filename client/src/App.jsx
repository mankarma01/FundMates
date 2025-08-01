import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/LoginComponent";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Group from "./components/Group";
import GroupsPage from "./components/GroupPage";
import AddExpense from "./components/AddExpense";
import GroupDetails from "./components/GroupDetails";
import Profile from "./components/Profile";
function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      ></Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/expenses" element={<AddExpense />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
