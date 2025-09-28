import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null); // null = creando, objeto = editando

  // Cargar usuarios
  const loadUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error cargando usuarios", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Abrir modal para nuevo usuario
  const openCreateModal = () => {
    setForm({ name: "", email: "", password: "" });
    setEditingUser(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (user) => {
    setForm({ name: user.name, email: user.email, password: "" });
    setEditingUser(user);
    setModalOpen(true);
  };

  // Eliminar usuario
  const deleteUser = (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" })
      .then(() => loadUsers())
      .catch((err) => console.error("Error eliminando usuario", err));
  };

  // Enviar formulario (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `http://localhost:8080/api/users/${editingUser.id}`
      : "http://localhost:8080/api/users";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        loadUsers();
        setModalOpen(false);
      })
      .catch((err) => console.error("Error guardando usuario", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Usuarios</h1>

        {/* Botón agregar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            + Agregar Usuario
          </button>
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow-md rounded p-4 border flex flex-col">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña (solo si deseas cambiarla)"
                className="w-full border p-2 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingUser}
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
