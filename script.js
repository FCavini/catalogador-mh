let dados = [
  {ativo: "EUR/USD", datahora: "2025-09-18 15:00", tipo: "Compra", resultado: "WIN"},
  {ativo: "GBP/USD", datahora: "2025-09-18 15:05", tipo: "Venda", resultado: "LOSS"},
  {ativo: "EUR/USD", datahora: "2025-09-18 15:10", tipo: "Compra", resultado: "WIN"}
];

const tabelaBody = document.querySelector("#catalogo tbody");
const filtroAtivo = document.getElementById("filtroAtivo");
const filtroResultado = document.getElementById("filtroResultado");

// Inicializa dropdown de ativos
function atualizarDropdown() {
  const ativosUnicos = [...new Set(dados.map(d => d.ativo))];
  filtroAtivo.innerHTML = `<option value="Todos">Todos</option>`;
  ativosUnicos.forEach(a => {
    const option = document.createElement("option");
    option.value = a;
    option.text = a;
    filtroAtivo.appendChild(option);
  });
}

// Preenche tabela
function preencherTabela(filtrados = dados) {
  tabelaBody.innerHTML = "";
  filtrados.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.ativo}</td>
                    <td>${d.datahora}</td>
                    <td>${d.tipo}</td>
                    <td>${d.resultado}</td>`;
    tabelaBody.appendChild(tr);
  });
  calcularEstatisticas(filtrados);
}

// Adicionar novo sinal
function adicionarSinal() {
  const ativo = document.getElementById("inputAtivo").value.trim();
  const datahora = document.getElementById("inputDataHora").value;
  const tipo = document.getElementById("inputTipo").value.trim();
  const resultado = document.getElementById("inputResultado").value;

  if(!ativo || !datahora || !tipo) { alert("Preencha todos os campos!"); return; }

  dados.push({ativo, datahora, tipo, resultado});
  atualizarDropdown();
  aplicarFiltros();
  // Limpar campos
  document.getElementById("inputAtivo").value = "";
  document.getElementById("inputDataHora").value = "";
  document.getElementById("inputTipo").value = "";
}

// Aplicar filtros
function aplicarFiltros() {
  let filtrados = dados;
  const ativo = filtroAtivo.value;
  const resultado = filtroResultado.value;
  const de = document.getElementById("filtroDe").value;
  const ate = document.getElementById("filtroAte").value;

  if(ativo !== "Todos") filtrados = filtrados.filter(d => d.ativo === ativo);
  if(resultado !== "Todos") filtrados = filtrados.filter(d => d.resultado === resultado);
  if(de) filtrados = filtrados.filter(d => d.datahora >= de);
  if(ate) filtrados = filtrados.filter(d => d.datahora <= ate);

  preencherTabela(filtrados);
}

// Estatísticas
let chartInstance = null;
function calcularEstatisticas(filtrados) {
  const total = filtrados.length;
  const wins = filtrados.filter(d => d.resultado === "WIN").length;
  const losses = total - wins;
  const taxa = total ? ((wins / total) * 100).toFixed(2) : 0;

  document.getElementById("estatisticas").innerText = 
    `Total: ${total} | WIN: ${wins} | LOSS: ${losses} | Taxa de acerto: ${taxa}%`;

  desenharGrafico(wins, losses);
}

// Gráfico de pizza
function desenharGrafico(wins, losses) {
  const ctx = document.getElementById('grafico').getContext('2d');
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['WIN', 'LOSS'],
      datasets: [{ data: [wins, losses], backgroundColor: ['#4caf50','#f44336'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

// Exportar CSV
function exportarCSV() {
  let csv = "Ativo,DataHora,TipoEvento,Resultado\n";
  dados.forEach(d => { csv += `${d.ativo},${d.datahora},${d.tipo},${d.resultado}\n`; });
  const blob = new Blob([csv], {type: "text/csv"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "catalogador_mhi.csv";
  link.click();
}

// Inicialização
atualizarDropdown();
preencherTabela();
