const SETTINGS = {
    LOCALE_BASE: '/api/v1/locale',
    BLOCK_BASE: '/api/v1/block',
    FOLDER_BASE: '/api/v1/folder',
}


//Locale
export async function getLocale(name) {
    const response = await fetch(`${SETTINGS.LOCALE_BASE}/${encodeURIComponent(name)}`)

    if (!response.ok) {
        console.warn(`Локаль ${name} не может быть получена`)
        return null;
    }

    return await response.json();
}


//Folder
export async function getFolderList(name) {
    const response = await fetch(`${SETTINGS.FOLDER_BASE}/${encodeURIComponent(name)}/list`);

    if (!response.ok) {
        console.warn(`Содержимое папки ${name} не может быть получено`);
        return null;
    }

    return await response.json();
}

export async function getFolderFileLink(name, file) {
    return `${SETTINGS.FOLDER_BASE}/${encodeURIComponent(name)}/get?attachment=${encodeURIComponent(file)}`
}


//Blocks
export async function getBlockList(name) {
    const response = await fetch(`${SETTINGS.BLOCK_BASE}/${encodeURIComponent(name)}/order`)

    if (!response.ok) {
        console.warn(`Порядок блока ${name} не может быть получен`)
        return null;
    }

    return await response.json();
}

export async function getBlockContent(name, object) {
    const response = await fetch(`${SETTINGS.BLOCK_BASE}/${encodeURIComponent(name)}/content?name=${encodeURIComponent(object)}`);

    if (!response.ok) {
        console.warn(`Контент`)
        return null;
    }

    return await response.json();
}

export async function getActiveAttachments(name, object) {
    const response = await fetch(`${SETTINGS.BLOCK_BASE}/${encodeURIComponent(name)}/attachments?name=${encodeURIComponent(object)}`);

    if (!response.ok) {
        console.warn(`Вложения блока ${name} не могут быть получены`)
        return null;
    }

    return await response.json();
}

export async function getBlockFileLink(name, object, file) {
    return `${SETTINGS.BLOCK_BASE}/${encodeURIComponent(name)}/attachment?name=${encodeURIComponent(object)}&attachment=${encodeURIComponent(file)}`
}

