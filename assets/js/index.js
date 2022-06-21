/* eslint-disable no-use-before-define */
function verificaIdadeMinima(data) {
	const dataAtual = new Date();
	const maiorQue18 = new Date(
		data.getUTCFullYear() + 18,
		data.getUTCMonth(),
		data.getUTCDate()
	);
	console.log(maiorQue18);
	return maiorQue18 <= dataAtual;
}

function validaCpf(input) {
	const cpfFormatado = input.value.replace(/\D/g, '');
	// eslint-disable-next-line prefer-const
	let mensagem = '';
	if (!cpfFormatado) mensagem = 'CPF informado não é valido';

	input.setCustomValidity(mensagem);
}

function validaDataNascimento(input) {
	const dataRecebida = new Date(input.value);
	// eslint-disable-next-line prefer-const
	let mensagemRetorno = '';

	if (!verificaIdadeMinima(dataRecebida)) {
		mensagemRetorno = 'A idade miníma para cadastro no site é de 18 anos';
	}

	input.setCustomValidity(mensagemRetorno);
}

const tiposDeErro = [
	'valueMissing',
	'typeMismatch',
	'patternMismatch',
	'customError',
];

const mensagemErro = {
	nome: {
		valueMissing: 'O campo nome não pode estar vazio.',
	},

	email: {
		valueMissing: 'O campo de e-mail não pode estar vazio.',
		typeMismatch: 'O e-mail digitado não é valido',
	},

	senha: {
		valueMissing: 'O campo de senha não pode estar vazio',
		patternMismatch:
			'A senha deve conter entre 6 e 12 caracteres, deve conter pelo menos uma letra minuscula, um número e não deve conter símbolos',
	},
	dataNascimento: {
		valueMissing: 'O campo de data de nascimento não pode estar vazio',
		customError: 'Vocë deve ser maior de 18 anos para se cadastrar',
	},
	cpf: {
		valueMissing: 'O campo de CPF não pode estar vazio',
		patternMismatch: 'CPF informado não é valido seu lerdo',
		customError: 'CPF informado não é valido',
	},
	cep: {
		valueMissing: 'O campo CEP não pode estar vazio',
		customError: 'Não é possível encontrar o CEP informado',
		patternMismatch: 'O CEP informado não é valido, se liga hein!',
	},
	logradouro: {
		valueMissing: 'O campo Logradouro não pode estar vazio',
	},
	cidade: {
		valueMissing: 'O campo Cidade não pode estar vazio',
	},
	estado: {
		valueMissing: 'O campo Estado não pode estar vazio',
	},
};

const validadores = {
	dataNascimento: (input) => validaDataNascimento(input),
	cpf: (input) => validaCpf(input),
	cep: (input) => recuperarCEP(input),
};

function mostraMsgErro(tipoDeInput, input) {
	// eslint-disable-next-line no-unused-vars
	let mensagem = '';
	tiposDeErro.forEach((erro) => {
		if (input.validity[erro]) {
			mensagem = mensagemErro[tipoDeInput][erro];
		}
	});

	return mensagem;
}

export function valida(input) {
	const tipoDeInput = input.dataset.tipo;
	if (validadores[tipoDeInput]) {
		validadores[tipoDeInput](input);
	}

	if (input.validity.valid) {
		input.parentElement.classList.remove('input-container--invalido');
		input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
	} else {
		input.parentElement.classList.add('input-container--invalido');
		input.parentElement.querySelector('.input-mensagem-erro').innerHTML =
			mostraMsgErro(tipoDeInput, input);
	}
}

function confirmaDigito(soma) {
	return 11 - (soma % 11);
}

function checaDigitoVerificador(cpf, multiplicador) {
	if (multiplicador >= 12) {
		return true;
	}

	let multiplicadorInicial = multiplicador;
	let soma = 0;
	const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
	const digitoVerificador = cpf.charAt(multiplicador - 1);
	// eslint-disable-next-line no-plusplus
	for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
		soma += cpfSemDigitos[contador] * multiplicadorInicial;
		// eslint-disable-next-line no-plusplus
		contador++;
	}

	if (digitoVerificador === confirmaDigito(soma)) {
		return checaDigitoVerificador(cpf, multiplicador + 1);
	}

	return false;
}

function checaCPF(cpf, multiplicador = 10) {
	multiplicador = 10;
	return checaDigitoVerificador(cpf, multiplicador);
}

function recuperarCEP(input) {
	const cep = input.value;

	const url = `https://viacep.com.br/ws/${cep}/json`;
	const options = {
		method: 'GET',
		mode: 'cors',
		headrs: {
			'content-type': 'application/json;charset=utf-8',
		},
	};
	if (!input.validity.patternMismatch && !input.validity.valueMissing) {
		fetch(url, options)
			.then((cepInformado) => cepInformado.json())
			.then((data) => {
				if (data.erro) {
					input.setCustomValidity('Não é possível encontrar o CEP informado');
					return;
				}
				input.setCustomValidity('');
				preencheCamposComCep(data);
			});
	}
}

function preencheCamposComCep(data) {
	const logradouro = document.querySelector(`[data-tipo="logradouro"]`);
	const cidade = document.querySelector(`[data-tipo="cidade"]`);
	const estado = document.querySelector(`[data-tipo="estado"]`);

	logradouro.value = data.logradouro;
	cidade.value = data.localidade;
	estado.value = data.uf;
}
