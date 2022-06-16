// eslint-disable-next-line import/extensions
import { valida } from './index.js';

const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
	input.addEventListener('blur', (evento) => {
		valida(evento.target);
	});
});
