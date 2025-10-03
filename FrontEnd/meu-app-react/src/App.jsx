import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// --- Serviços de Dados (Mocks) ---
const novaPessoa = async (data) => {
  console.log("POST/PUT: Nova Pessoa", data);
  return { id: Date.now(), ...data };
};
const buscaPessoa = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: "a1", nome: "Ana Souza", idade: 28 },
    { id: "b2", nome: "Bruno Costa", idade: 35 },
    { id: "c3", nome: "Carla Lima", idade: 22 },
  ];
};
const updatePessoa = async (id, data) =>
  console.log("PUT: Atualizar Pessoa", id, data);
const deletePessoa = async (id) => console.log("DELETE: Deletar Pessoa", id);

// --- Hook Customizado ---
const useDataFetcher = (fetchFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError("Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, setData, refetch };
};

// --- Botão ---
const Button = ({ children, onClick, type = "button", variant = "primary" }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${variant}`}>
      {children}
    </button>
  );
};

// --- Modal ---
const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>
        ✖
      </button>
      {children}
    </div>
  </div>
);

// --- App Principal ---
function App() {
  const { data: pessoas, loading, error, setData, refetch } =
    useDataFetcher(buscaPessoa);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", idade: "" });
  const [currentPessoa, setCurrentPessoa] = useState(null);

  const handleOpenModal = (pessoa = null) => {
    setCurrentPessoa(pessoa);
    setFormData(pessoa || { nome: "", idade: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (currentPessoa) {
      await updatePessoa(currentPessoa.id, formData);
    } else {
      await novaPessoa(formData);
    }
    await refetch();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await deletePessoa(id);
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Painel de Gestão</h1>
      </header>

      <main className="container">
        <div className="topbar">
          <h2>Pessoas Cadastradas</h2>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            + Novo
          </Button>
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.idade}</td>
                  <td>
                    <Button variant="secondary" onClick={() => handleOpenModal(p)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(p.id)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
              {pessoas.length === 0 && (
                <tr>
                  <td colSpan="4">Nenhuma pessoa cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2>{currentPessoa ? "Editar Pessoa" : "Nova Pessoa"}</h2>
          <form onSubmit={handleFormSubmit} className="form">
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleFormChange}
                required
              />
            </label>
            <label>
              Idade:
              <input
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleFormChange}
                required
              />
            </label>
            <div className="form-actions">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <footer className="footer">
        <p>© 2025 - Gestão de Pessoas</p>
      </footer>
    </div>
  );
}

export default App;
