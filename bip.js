const sources = [1, 2].map(i => ({
	select: document.querySelector(`[name=l${i}]`),
	text: document.querySelector(`[name=t${i}]`)
}))

const target = document.querySelector("[name=target]");

const defaults = {
	"l1": "🇨🇿",
	"l2": "🇬🇧"
}


function fillFlags(select, data) {
	data
		.map(item => new Option(`${item.emoji} ${item.name}`, item.emoji))
		.forEach(node => select.appendChild(node))
}

function update() {
	target.value = sources.map(source => `${source.select.value} ${source.text.value}`).join("\n\n");
}

function onChange(e) {
	localStorage.setItem(`bip-${e.target.name}`, e.target.value);
	update();
}
function onInput(e) { update(); }

async function init() {
	let r = await fetch("https://unpkg.com/browse/country-flag-emoji-json@latest/dist/index.json");
	let data = await r.json();

	sources.forEach(source => {
		let select = source.select;
		fillFlags(select, data);
		select.value = localStorage.getItem(`bip-${select.name}`) || defaults[select.name];

		select.addEventListener("change", onChange);
		source.text.addEventListener("input", onInput);
	});

	target.addEventListener("click", e => {
		e.target.selectionStart = 0;
		e.target.selectionEnd = e.target.value.length;
	});
}

init();
