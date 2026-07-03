import * as AdminAPI from '/js/admin-integration.js'


async function addMagazines() {
    const grid = document.getElementById('magazine-grid');
    if (!grid) {
        return;
    }

    const dataOrder = await AdminAPI.getFolderList("журналы");
    if (!dataOrder || !Array.isArray(dataOrder)) {
        grid.innerHTML = `<p class="no-data">Не удалось получить данные о журналах</p>`;
        return;
    }

    for (const file of dataOrder) {
        const filename = file.name;
        const name = filename.slice(0, filename.lastIndexOf('.'));

        grid.insertAdjacentHTML('beforeend', `<a class="magazine__name" href="${await AdminAPI.getFolderFileLink("журналы", name)}">${name}</a>`);
    }
}


async function init() {
    await addMagazines();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
