const elementoLista = document.getElementById("lista");
const elementoOrdenacao = document.querySelector("select");

const elementoPesquisa = document.querySelector("#edtPesquisa");
const elementoDataList = document.querySelector("#dlPaises");
const switchPesquisarAoDigitar = document.querySelector(
    "#switchPesquisarAoDigitar"
);

var cache_lista_pais = [];

/**
 * Função que busca a lista de paises e retorna uma *Promisse com a lista.
 * *Promisse são funções assincronas que utilizam o .then e .catch para obter o resultado;
 * @returns Promisse(object[])
 */
async function carregarLista() {
    if (cache_lista_pais.length > 0) {
        return cache_lista_pais;
    }
    // variável com o link da API
    const link_api = "https://restcountries.com/v3.1/all";
    // função fecth que busca os dados via HTTP GET
    return fetch(link_api)
        .then(function (response) {
            return response.json();
        })
        .then(function (obj) {
            cache_lista_pais = obj;
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
    // Tipo de ordenação
    switch (ordernarPor) {
        case "regiao":
            // a funçao sort recebe uma função que tem dois parametros
            // e irá compará-los, caso o retoro seja negativo inverterá
            // os valores, assim ordenando a lista
            return lista.sort(function (anterior, atual) {
                return anterior.region > atual.region ? 1 : -1;
            });
        case "nome":
            return lista.sort(function (anterior, atual) {
                return anterior.name.common > atual.name.common ? 1 : -1;
            });
        case "capital":
            return lista.sort(function (anterior, atual) {
                return anterior.capital > atual.capital ? 1 : -1;
            });
        default:
            return lista;
    }
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
    item.style.cursor = "pointer"; // Add estilo CSS inline
    item.classList.add(
        "list-group-item",
        "list-group-item-action",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    // Adicionar evento de clique para mostrar detalhes do pais
    item.addEventListener("click", (evento) => {
        mostrarDetalhesItem(pais);
    });

    // template string
    const conteudo = `<span>[${pais.flag}] ${pais.region}</span> <b>${
        pais.name.common
    }</b> <i>${pais.capital || ""}</i>`;
    // adicionar conteúdo ao elemento <li> como HTML
    item.innerHTML = conteudo;

    // adicionar elemento como filho ao elemento lista
    elementoLista.appendChild(item);
}

/**
 * Atualiza os elementos da tela
 * @param {*} lista
 */
function atualizarTela(lista) {
    //limpar elementos
    elementoLista.innerHTML = "";
    elementoDataList.innerHTML = "";
    for (pais of lista) {
        adicionarPaisNaTela(pais);
        adicionarPaisNaListaDeDados(pais);
    }
}

/**
 * Carregar Dados
 */
async function carregarDados() {
    return carregarLista()
        .then((lista) => {
            // arrow function: função anônima definida com =>
            // será executada se não ocorrer erro

            // ordenar lista
            const ordernarPor = elementoOrdenacao.value;
            lista = ordenar(lista, ordernarPor);

            atualizarTela(lista);

            return lista;
        })
        .catch((err) => {
            // função será chamada caso ocorra um erro
            console.error(err);
        });
}

/**
 * Mostrar Detalhes Item
 * @param {*} item
 */
function mostrarDetalhesItem(item) {
    Swal.fire({
        //title: item.flag + "<br/>" + item.name.common,
        title: "<h1>" + item.flag + "</h1>" + item.name.common,
        html: `
        <div>
            <dl class="d-flex flex-column justify-content-start align-items-start">
            
            <dt>Nome Oficial:</dt>
            <dd>${item.name.official}</dd>

            <dt>Região:</dt>
            <dd>${item.region}</dd>

            <dt>Tradução:</dt>
            <dd>${item.translations.por.common}</dd>

            <dt>Capital:</dt>
            <dd>${item.capital}</dd>

            <dt>População:</dt>
            <dd>${new Intl.NumberFormat().format(item.population)}</dd>

            <dt>Idiomas:</dt>
            <dd>${Object.keys(item.languages)
                .map((key) => item.languages[key])
                .join(", ")}</dd>

            <dt>Moedas:</dt>
            <dd>${Object.keys(item.currencies)
                .map(
                    (key) =>
                        `${item.currencies[key].name} (${item.currencies[key].symbol})`
                )
                .join(", ")}</dd>

            <dt>Timezones:</dt>
            <dd>${item.timezones.join(", ")}</dd>

            <dt>Mapa:</dt>
            <dd><a href="${
                item.maps.googleMaps
            }" target="_blank"> Google Maps </a></dd>
            </dl>
        </div>`,
        focusConfirm: false,
        confirmButtonText: "Ok",
        animation: true,
    });
}

/**
 * Adiciona Pais Na Lista De Dados
 * @param {*} pais
 */
function adicionarPaisNaListaDeDados(pais) {
    if (!elementoDataList) {
        return;
    }
    const dataListItem = document.createElement("option");
    dataListItem.value = pais.name.common;
    elementoDataList.appendChild(dataListItem);
}

/**
 *
 * @param {*} filtro
 */
function filtrarPaises(filtro) {
    carregarDados().then((lista) => {
        const lista_filtrada = lista.filter(
            (pais) =>
                `${pais.region} ${pais.name.common} ${pais.capital}`
                    .toUpperCase()
                    .indexOf(filtro.toUpperCase()) >= 0
        );
        atualizarTela(lista_filtrada);
        return lista_filtrada;
    });
}

/**
 * Função declarada como variável *constante
 * @param {*} chave
 * @param {*} valor
 */
const salvarInformacao = (chave, valor) => {
    /** API LocalStorage armazena dados no navegador */
    localStorage.setItem(chave, `${valor}`);
};

/**
 * Função com inline context (sem contexto com {}), assim podemos emitir o return;
 * @param {*} chave
 * @returns
 */
const obterInformacaoSalva = (chave) => localStorage.getItem(chave);

/**
 * Instruções que serão executadas quando carregar o arquivo no navegador
 */
/**
 * evento que é disparado ao alterar o valor do select
 */
elementoOrdenacao.addEventListener("change", (evento) => {
    filtrarPaises(elementoPesquisa.value);
});

/**
 * evento que é disparado ao precionar uma tecla
 */
elementoPesquisa.addEventListener("keyup", (evento) => {
    // Ao digitar enter ou se o pesquisar ao digitar estiver marcado
    if (evento.keyCode === 13 || switchPesquisarAoDigitar.checked) {
        filtrarPaises(evento.target.value);
    }
});

/**
 * evento dispara quando altera o switch
 */
switchPesquisarAoDigitar.addEventListener("change", (evento) => {
    salvarInformacao(
        "switchPesquisarAoDigitar",
        evento.target.checked ? "Sim" : "Não"
    );
});

carregarDados();

/** Carrega os dados salvos para manter configuração anterior ao atualizar a página */
const dado = obterInformacaoSalva("switchPesquisarAoDigitar");
switchPesquisarAoDigitar.checked = (dado == "Sim") ? true : false;