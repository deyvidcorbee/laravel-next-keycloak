import React           from "react";
import Link            from "next/link";
import { AuthContext } from "../../context/auth-context";

export default function Header() {

    const { user, logout, login } = React.useContext(AuthContext);

    return (
        <nav className="bg-orange-500 pl-10 py-5 flex justify-between px-10 mb-5">
            {user ? (
                <>
                    <ul className="list-none flex gap-4 items-center">
                        <li className="text-2xl text-white">Keycloak CRUD</li>
                        <li className="ml-10 underline"><Link href="/dashboard">Dashboard</Link></li>
                        <li className="underline"><Link href="/users">Users</Link></li>
                    </ul>
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <span>Olá, {user.preferred_username}!</span>
                            <strong className="cursor-pointer underline" onClick={logout}>Sair</strong>
                        </div>
                        <small>({user.email})</small>
                    </div>
                </>
            ) : (
                <>
                    <ul className="list-none flex gap-4 items-center">
                        <li className="text-2xl text-white">Keycloak CRUD</li>
                    </ul>
                    <strong className="cursor-pointer underline" onClick={login}>Login</strong>
                </>
            )}
        </nav>
    );
}