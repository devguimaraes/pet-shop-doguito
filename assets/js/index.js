// arquivo principal do projeto
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

function validaDataNascimento(input) {
	const dataRecebida = new Date(input.value);
	// eslint-disable-next-line prefer-const
	let mensagemRetorno = '';

	if (!verificaIdadeMinima(dataRecebida)) {
		mensagemRetorno = 'A idade miníma para cadastro no site é de 18 anos';
	}

	input.setCustomValidity(mensagemRetorno);
}

const validadores = {
	dataNascimento: (input) => validaDataNascimento(input),
};

export function valida(input) {
	const tipoDeInput = input.dataset.tipo;
	if (validadores[tipoDeInput]) {
		validadores[tipoDeInput](input);
	}
}
