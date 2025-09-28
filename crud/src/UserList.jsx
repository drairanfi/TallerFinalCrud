import React from "react";

const users = [
  { id: 1, name: "Daniel", email: "daniel@example.com" },
  { id: 2, name: "Luis", email: "luis@example.com" },
  { id: 3, name: "Jose", email: "jose@example.com" },
];

export default function UserList() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Lista de Usuarios</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start gap-3 border border-gray-700"
          >
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>

            <div className="flex gap-3 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
                 Editar
              </button>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
