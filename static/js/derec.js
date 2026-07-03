import * as AdminAPI from '/js/admin-integration.js'


async function applyIdText(id, text, bool) {
    if (text) {
        let object = document.getElementById(id);
        object.innerHTML = (bool) ? text.replaceAll('\n', '<br>') : text;
    }
}

async function useLocale() {
    const locale = await AdminAPI.getLocale('дирекция');

    await applyIdText('title', locale.название, false);
    await applyIdText('description', locale.описание, false);
    await applyIdText('name', locale.фио, false);
    await applyIdText('advantages', locale.заслуги, false);
    await applyIdText('education', locale.образование, false);
    await applyIdText('experience', locale.опыт, true);
    await applyIdText('facts', locale.факты, false);
    
    await applyIdText('members', locale.коллектив, true);
    await applyIdText('purposes', locale.цели, true);
    await applyIdText('tasks', locale.задачи, false);
}

async function addTeam() {
    const slider = document.querySelector(".slider");

    const teamOrder = await AdminAPI.getBlockList("команда");

    for (const id of teamOrder) {
        const cardBack = document.createElement('a');
        cardBack.href = '#';
        cardBack.className = 'slider__link'


        const card = document.createElement('div');
        card.classList = 'slider__item';

        const content = await AdminAPI.getBlockContent("команда", id);

        card.innerHTML = `
            <div class="slider__photo">
                <img src="${await AdminAPI.getBlockFileLink("команда", id, "photo")}" alt="Фото" class="slider__photo-img">
            </div>
            <h3 class="slider__name">${content.fullname}</h3>
            <p class="slider__position">${content.post}</p>
            <ul class="slider__contact">
                <li>${content.number}</li>
                <li>${content.email}</li>
            </ul>`

        cardBack.appendChild(card);
        slider.appendChild(cardBack);

        cardBack.addEventListener('click', () => {
            openAbout(id)
        });
    }
}

async function openAbout(id) {
    const modal = document.getElementById('metroModal');
    const about = document.getElementById('modalContent');

    const content = await AdminAPI.getBlockContent("команда", id);

    let html = `
        <div class="hero--piter">
            <div class="hero__container">
                <div class="hero__content">
                    <h1 class="hero__title">${content.fullname || 'Неназванный сотрудник'}</h1>
                    <p class="hero__subtitle">${content.mini}</p>
                </div>
                <div class="hero__logo" id="logo-container-${id}">
                    <img src="${await AdminAPI.getBlockFileLink("команда", id, "photo")}" alt="photo" onerror="this.style.display='none'" class="modal-image">
                </div>
            </div>
        </div>
    `;

        
    if (content.about) {
        html += `
            <div class="piter-section piter-section--white" id="section-desc-one-${id}" data-section-type="image-text">
                <div class="piter-section__container">
                    <div class="piter-section__text">
                        <h2 class="piter-section__title">О СОТРУДНИКЕ</h2>
                        <p class="piter-section__paragraph">${content.about.replaceAll('\n', '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }


    if (content.number || content.email) {
        html += `
            <div class="piter-section piter-section--white piter-section--double-text">
                <div class="piter-section__container">
                    ${content.number ? `
                        <div class="piter-section__text-block">
                            <h2 class="piter-section__title">ТЕЛЕФОН</h2>
                            <p class="piter-section__paragraph">${content.number}</p>
                        </div>
                    ` : ''}
                    ${content.email ? `
                        <div class="piter-section__text-block">
                            <h2 class="piter-section__title">ПОЧТА</h2>
                            <p class="piter-section__paragraph">${content.email}</p>
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
    useLocale();
    addTeam();

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