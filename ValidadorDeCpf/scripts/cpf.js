/**
 * Função de validação de um número de CPF
 * @refer https://www.macoratti.net/alg_cpf.htm
 * @param {*} cpf
 * @returns
 */
function validarCPF(cpf) {
  // transforma o cpf em uma string
  if (typeof cpf == "number") {
    cpf = `${cpf}`;
  }

  // Remove caracteres extras - Expressão regular
  cpf = cpf.replace(/[^0-9]/g, "");

  // Verifica se o CPF tem o tamanho correto
  if (cpf.length !== 11) return false;

  // Cálculo do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }

  let digito = 0;
  let resto = soma % 11;
  if (resto >= 2) {
    digito = 11 - resto;
  }

  if (parseInt(cpf[9]) !== digito) {
    return false;
  }

  // Cálculo do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }

  digito = 0;
  resto = soma % 11;
  if (resto >= 2) {
    digito = 11 - resto;
  }

  if (parseInt(cpf[10]) !== digito) {
    return false;
  }

  return true;
}


// validarCPF("11111111111") ? console.log("Verdadeiro") : console.log("Falso");
// validarCPF("00000000000") ? console.log("Verdadeiro") : console.log("Falso");
// validarCPF("00000000001") ? console.log("Verdadeiro") : console.log("Falso");
// validarCPF("10000000001") ? console.log("Verdadeiro") : console.log("Falso");
