import axios           from 'axios';
import { useContext, useEffect, useState } from 'react';
import Header          from "../components/header";
import { AuthContext } from '../context/auth-context';
import useHttp from '../hooks/useHttp';

export default function Home() {

    const { keycloak }               = useContext(AuthContext);
    const [users, setUsers]          = useState([]);
    const { get, put, Delete, post } = useHttp(keycloak);

    const getUsers = async () => {
        const response = await get('/users?test=' + Date.now());
        setUsers(response ?? []);
    }

    const changeStatus = async (user) => {
        const response = await put(`/users/${user.id}/status`, {status: user.status === 'on' ? 'off' : 'on'});
        if (!response) return;
        await getUsers();
    }

    const deleteUser = async (user) => {
        const yes = confirm('Deseja realmente remover esse usuário? Essa ação não podero ser desfeita.');
        if (yes) {
            const response = Delete(`/users/${user.id}`);
            if (!response) return;
            await getUsers();
        }
    }

    const addUser = async () => {
        const email = prompt('Informe o email do novo usuário!');
        const password = prompt('Informe a senha do usuário');
        if (!email || !password) {
            alert('O email e a senha devem ser informados');
            return;
        }

        await createUser(email, password);
    }

    const createUser = async (email, password) => {
        const response = await post('/users', {email, password});
        if (!response) return;
        await getUsers();
    }

    useEffect(() => {
        getUsers();
    }, []);

    if (users.length === 0) {
        return (
            <>
                <Header />
                <div className="px-10">
                    Listagem de usuários
                </div>
            </>    
        );
    }

    return (
        <>
            <Header />
            <div className="px-10 text-2xl flex justify-between">
                Listagem de usuários
                <button className='p-1 bg-green-600 text-white rounded-md' onClick={addUser}>
                    Adicionar
                </button>
            </div>
            <div className='px-10 mt-5'>
                <table className='w-full'>
                    <thead className='bg-gray-400 text-center'>
                        <tr>
                            <td>Usuário</td>
                            <td>E-mail</td>
                            <td>Status</td>
                            <td>Ações</td>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className={`${index % 2 == 0 ? 'bg-slate-200' : 'bg-white'} text-center`}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Status value={user.status} />
                                </td>
                                <td className='flex gap-4 justify-center'>
                                    <button
                                        onClick={() => changeStatus(user)}
                                        className={`${user.status === 'on' ? 'bg-red-500' : 'bg-blue-600'} text-white p-1 rounded-md`}>
                                        {user.status === 'on' ? 'Inativar' : 'Ativar'}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user)}
                                        className={'bg-red-500 text-white p-1 rounded-md'}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

const Status = ({ value }) => {
    return (
        <span className={value === 'on' ? 'text-blue-600' : 'text-red-600'}>
            {value === 'on' ? 'Ativo' : 'Inativo'}
        </span>
    );
}