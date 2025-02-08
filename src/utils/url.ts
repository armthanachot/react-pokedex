
const getParam = (url: string) => {
    const urlSplit = url.split('/');
    return urlSplit[urlSplit.length - 2];
}

export { getParam };