import * as AdminAPI from '/js/admin-integration.js'


async function addCommittees() {
    const grid = document.getElementById('comitet-grid');
    if (!grid) {
        return;
    } 

    const dataOrder = await AdminAPI.getBlockList("комитет");
    if (!dataOrder || !Array.isArray(dataOrder)) {
        grid.innerHTML = `<p class="no-data">Не удалось получить данные о комитетах</p>`;
        return;
    }
    
    for (const id of dataOrder) {
        const content = await AdminAPI.getBlockContent("комитет", id);
        let name = "Ненезванный комитет";        
        if (content.name) name = content.name;

        const card = document.createElement('div');
        card.className = 'comitet-item';

        card.innerHTML = `
        <div class="comitet-item__image">
            <img src="${await AdminAPI.getBlockFileLink("комитет", id, "logo")}" alt="${name}">
        </div>
        <p class="comitet-item__name">${name}</p>`

        card.addEventListener('click', () => {
            openAbout(id);
        });

        card.style.cursor = "pointer";


        grid.appendChild(card);
    }
}

async function openAbout(id) {
    const modal = document.getElementById('metroModal');
    const about = document.getElementById('modalContent');

    const content = await AdminAPI.getBlockContent("комитет", id);
    const attachments = await AdminAPI.getActiveAttachments("комитет", id) || [];

    let html = `
        <div class="hero--piter">
            <div class="hero__container">
                <div class="hero__content">
                    <h1 class="hero__title">${content.name || 'Неназванный комитет'}</h1>
                    <p class="hero__subtitle">${content.short_desc}</p>
                </div>
                <div class="hero__logo" id="logo-container-${id}">
                    <img src="${await AdminAPI.getBlockFileLink("комитет", id, "logo")}" alt="logo" onerror="this.style.display='none'" class="modal-image">
                </div>
            </div>
        </div>
    `;


    if (content.head_name || content.deputy_name) {
        let teamHtml = '<div class="team-list">';
        
        if (content.head_name) {
            teamHtml += `
                <div class="team-photo">
                    <img src="${await AdminAPI.getBlockFileLink("комитет", id, "head")}" alt="head">
                    <div class="piter-section__paragraph">${content.head_name.replaceAll('\n', '<br>')}</div>
                </div>
            `;
        }
        
        if (content.deputy_name) {
            teamHtml += `
                <div class="team-photo">
                    <img src="${await AdminAPI.getBlockFileLink("комитет", id, "deputy")}" alt="deputy">
                    <div class="piter-section__paragraph">${content.deputy_name.replaceAll('\n', '<br>')}</div>
                </div>
            `;
        }
        
        teamHtml += '</div>';
        html += teamHtml;
    }


    if (content.full_desc_one) {
        const hasIcon = attachments.includes("mini_icon");
        const hasFile = attachments.includes("file");

        html += `
            <div class="piter-section piter-section--white" id="section-desc-one-${id}" data-section-type="image-text">
                <div class="piter-section__container">
                    <div class="piter-section__image">
                        <img src="${await AdminAPI.getBlockFileLink("комитет", id, "desc_one")}" alt="desc_one" onerror="this.style.display='none'" class="modal-image">
                    </div>
                    <div class="piter-section__text">
                        <div class="committee-about__head">
                            ${hasIcon ? `<img src="${await AdminAPI.getBlockFileLink("комитет", id, "mini_icon")}" alt="" class="committee-about__icon" onerror="this.style.display='none'">` : ''}
                            <h2 class="piter-section__title">${content.is == true ? "О КОМИТЕТЕ" : "О ПОДКОМИТЕТЕ"}</h2>
                        </div>
                        <p class="piter-section__paragraph">${content.full_desc_one}</p>
                        ${hasFile ? `
                        <a class="committee-file" href="${await AdminAPI.getBlockFileLink("комитет", id, "file")}" target="_blank" rel="noopener">Скачать документ</a>
                        ` : ''}
                        ${content.members ? `
                        <details class="committee-members">
                            <summary class="committee-members__summary">Список участников</summary>
                            <div class="committee-members__body">${content.members.replaceAll('\n', '<br>')}</div>
                        </details>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    if (content.full_desc_two) {
        html += `
            <div class="piter-section piter-section--blue" id="section-desc-two-${id}" data-section-type="image-text">
                <div class="piter-section__container">
                    <div class="piter-section__image">
                        <img src="${await AdminAPI.getBlockFileLink("комитет", id, "desc_two")}" alt="desc_two" onerror="this.style.display='none'" class="modal-image">
                    </div>
                    <div class="piter-section__text">
                        <p class="piter-section__paragraph">${content.full_desc_two}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (content.specs_desc || content.functions_desc) {
        html += `
            <div class="piter-section piter-section--white piter-section--double-text">
                <div class="piter-section__container">
                    ${content.specs_desc ? `
                        <div class="piter-section__text-block">
                            <h2 class="piter-section__title">ОСОБЕННОСТИ</h2>
                            <p class="piter-section__paragraph">${content.specs_desc}</p>
                        </div>
                    ` : ''}
                    ${content.functions_desc ? `
                        <div class="piter-section__text-block">
                            <h2 class="piter-section__title">ФУНКЦИИ</h2>
                            <p class="piter-section__paragraph">${content.functions_desc}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    history.pushState(null, null, location.href);
    
    about.innerHTML = html;
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
}

async function closeAbout() {
    const modal = document.getElementById('metroModal');
    const about = document.getElementById('modalContent');

    about.innerHTML = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function init() {
    await addCommittees();

    const overlay = document.getElementById('modalOverlay');

    overlay.addEventListener('click', () => {
        closeAbout();
    });

    window.addEventListener('popstate', function(event) {
        closeAbout();
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}