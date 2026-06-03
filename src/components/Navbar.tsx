import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({
    onLogoutClick,
}: {
    onLogoutClick: () => void;
}) => {
    const { user } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | USER DATA
    |--------------------------------------------------------------------------
    */
    const displayName = user?.name || "-";

    const displayRole = user?.role
        ? user.role.charAt(0).toUpperCase() +
          user.role.slice(1)
        : "-";

    const avatarInitials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    /*
    |--------------------------------------------------------------------------
    | ROLE CHECK
    |--------------------------------------------------------------------------
    */
    const isAdmin = user?.role === "admin";

    /*
    |--------------------------------------------------------------------------
    | EMPLOYEE MENUS
    |--------------------------------------------------------------------------
    */
    const employeeMenus = [
        {
            to: "/",
            label: "Dashboard",
        },

        {
            to: "/transaksi",
            label: "Input transaksi",
        },

        {
            to: "/riwayat",
            label: "Riwayat transaksi",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | ADMIN MENUS
    |--------------------------------------------------------------------------
    */
    const adminMenus = [
        {
            to: "/admin/dashboard",
            label: "Dashboard Admin",
        },

        {
            to: "/admin/riwayat",
            label: "Riwayat Laundry",
        },

        {
            to: "/admin/users",
            label: "Manajemen User",
        },

        {
            to: "/admin/customers",
            label: "Database Customer",
        },

        {
            to: "/admin/financial",
            label: "Laporan Keuangan",
        },
    ];

    const menus = isAdmin
        ? adminMenus
        : employeeMenus;

    return (
        <aside className="sidebar">
            <div>
                {/* LOGO */}
                <div className="sidebar-logo">
                    <span>LAUNDRYinAja</span>
                </div>

                {/* MENU */}
                <nav className="sidebar-menu">
                    {menus.map((menu, index) => (
                        <NavLink
                            key={index}
                            to={menu.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                        >
                            {menu.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* PROFILE */}
            <div
                className="sidebar-profile-box"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {avatarInitials}
                    </div>

                    <div className="profile-details">
                        <span className="profile-name">
                            {displayName}
                        </span>

                        <span className="profile-role">
                            {displayRole}
                        </span>
                    </div>
                </div>

                {/* STATUS */}
                {user && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: user.is_active
                                ? "#16a34a"
                                : "#9ca3af",
                        }}
                    >
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background:
                                    user.is_active
                                        ? "#22c55e"
                                        : "#d1d5db",
                            }}
                        />

                        {user.is_active
                            ? "Aktif"
                            : "Tidak aktif"}
                    </div>
                )}

                {/* LOGOUT */}
                <button
                    onClick={onLogoutClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        color: "#ef4444",
                        background: "#fef2f2",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: "100%",
                    }}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Navbar;