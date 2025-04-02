import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import brazilStates from './br_states.json';
import { geoCentroid } from 'd3-geo';
import { FaPlus, FaRegEye } from 'react-icons/fa';  // Ícones para adicionar e ver

const estadosValidos = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6347', '#2E8B57', '#D2691E', '#FFD700', '#DC143C', '#8A2BE2', '#7FFF00'];

const App = () => {
    const [nomeLojista, setNomeLojista] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [lojistasPorEstado, setLojistasPorEstado] = useState([]);
    const [todosLojistas, setTodosLojistas] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState('');

    const validarEstado = (sigla) => estadosValidos.includes(sigla.toUpperCase());

    const handleAddAssociado = () => {
        if (!nomeLojista || !cnpj || !endereco || !cidade || !estado) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        const estadoSigla = estado.toUpperCase();
        if (!validarEstado(estadoSigla)) {
            alert('Sigla de estado inválida!');
            return;
        }
        const novoLojista = { nomeLojista, cnpj, endereco, cidade, estado: estadoSigla };
        setLojistasPorEstado((prev) => [...prev, novoLojista]);
        setTodosLojistas((prev) => [...prev, novoLojista]);
        setNomeLojista('');
        setCnpj('');
        setEndereco('');
        setCidade('');
        setEstado('');
    };

    const handleStateClick = (geo) => {
        const estadoClicado = geo.properties?.SIGLA?.toUpperCase();
        if (!estadoClicado) return;
        
        setEstadoSelecionado(estadoClicado);
    
        const lojistasNoEstado = todosLojistas.filter((lojista) => lojista.estado === estadoClicado);
        setLojistasPorEstado(lojistasNoEstado);
    };

    const handleMostrarTodos = () => {
        setLojistasPorEstado(todosLojistas);
        setEstadoSelecionado('');
    };

    const data = estadosValidos.map((estado, index) => {
        const count = todosLojistas.filter((lojista) => lojista.estado === estado).length;
        return { name: estado, value: count };
    });

    return (
        <div className="p-8 bg-gradient-to-r from-blue-600 to-green-400 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-6 text-center">Cadastro de Associados</h1>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className="bg-white text-gray-800 p-3 rounded-lg shadow-md" placeholder="Nome" value={nomeLojista} onChange={(e) => setNomeLojista(e.target.value)} />
                <input className="bg-white text-gray-800 p-3 rounded-lg shadow-md" placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                <input className="bg-white text-gray-800 p-3 rounded-lg shadow-md" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                <input className="bg-white text-gray-800 p-3 rounded-lg shadow-md" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                <input className="bg-white text-gray-800 p-3 rounded-lg shadow-md" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
                <button className="bg-blue-500 text-white p-3 rounded-lg shadow-lg flex items-center justify-center space-x-2" onClick={handleAddAssociado}>
                    <FaPlus /> <span>Cadastrar</span>
                </button>
            </div>

            <div className="mb-8">
                <PieChart width={800} height={400}>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#82ca9d">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            <div className="mb-8">
                <ComposableMap
                    className="border-2 border-white mt-6"
                    style={{ marginTop: '10px', width: '100%', height: 'auto' }}
                    projectionConfig={{ scale: 300 }}
                >
                    <Geographies geography={brazilStates}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleStateClick(geo)}
                                    style={{
                                        default: { fill: '#E5E5E5', outline: 'none' },
                                        hover: { fill: '#FF6347', outline: 'none' },
                                        pressed: { fill: '#FF0000', outline: 'none' },
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ComposableMap>
            </div>

            <button className="bg-gray-700 text-white p-3 rounded-lg shadow-md mb-8 flex items-center justify-center space-x-2" onClick={handleMostrarTodos}>
                <FaRegEye /> <span>Mostrar Todos</span>
            </button>

            <h2 className="text-xl mb-4">{`Lojistas - ${estadoSelecionado || 'Todos os Estados'}`}</h2>
            <ul className="list-disc ml-6">
    {lojistasPorEstado.map((lojista, index) => (
        <li key={index}>
            <span className="font-semibold">{index + 1}. </span>
            {lojista.nomeLojista} - {lojista.cnpj} - {lojista.endereco} - {lojista.cidade} - {lojista.estado}
        </li>
    ))}
</ul>

        </div>
    );
};

export default App;
