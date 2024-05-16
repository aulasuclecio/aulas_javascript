var elementoLista = document.getElementById("lista");
var elementoOrdenacao = document.querySelector("select");

/**
 * Função que busca a lista de paises e retorna uma *Promisse com a lista.
 * *Promisse são funções assincronas que utilizam o .then e .catch para obter o resultado;
 * @returns Promisse(object[])
 */
function carregarLista() {
  // variável com o link da API
  const link_api = "https://restcountries.com/v3.1/all";
  // função fecth que busca os dados via HTTP GET
  return fetch(link_api)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      return obj;
    });
}

/**
 * Função que ordena a lista pelo valor passado
 * @param object[] lista
 * @param string ordernarPor 
 * @returns object[]
 */
function ordenar(lista, ordernarPor) {
  if (!elementoOrdenacao) {
    return lista;
  }
  // Tipo de ordenação
  if (ordernarPor == "regiao") {
    // a funçao sort recebe uma função que tem dois parametros 
    // e irá compará-los, caso o retoro seja negativo inverterá
    // os valores, assim ordenando a lista
    return lista.sort(function (anterior, atual) {
      return anterior.region > atual.region ? 1 : -1;
    });
  } else if (ordernarPor == "nome") {
    return lista.sort(function (anterior, atual) {
      return anterior.name.official > atual.name.official ? 1 : -1;
    });
  }
  // TODO: Adicionar demais ordenações 
  /** ... */
}
/**
 * Add item na tela
 * @param object pais  
 */
function adicionarPaisNaTela(pais) {
  if (!elementoLista) {
    return;
  }
  // criar um novo elemento html <li>
  const item = document.createElement("li");
  // TODO: Adicionar evento de clique para mostrar detalhes do pais
  /** ... */
  // template string
  const conteudo = `[${pais.flag}] ${pais.region}: <b>${pais.name.official}</b> - <i>${pais.capital}</i>`;
  // adicionar conteúdo ao elemento <li> como HTML
  item.innerHTML = conteudo;
  // adicionar elemento como filho ao elemento lista
  elementoLista.appendChild(item);
}

/**
 * Carregar Dados
 */
function carregarDados() {
  carregarLista()
    .then((lista) => {
      // arrow function: função anônima definida com =>
      // será executada se não ocorrer erro

      // ordenar lista
      const ordernarPor = elementoOrdenacao.value;
      lista = ordenar(lista, ordernarPor);

      //limpar elementos
      elementoLista.innerHTML = "";
      for (pais of lista) {
        adicionarPaisNaTela(pais);
      }
    })
    .catch((err) => {
      // função será chamada caso ocorra um erro
      console.error(err);
    });
}

/**
 * Instruções que serão executadas quando carregar o arquivo no navegador
 */
elementoOrdenacao.addEventListener("change", (evento) => {
  carregarDados();
});

carregarDados();