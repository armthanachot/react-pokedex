const splitUrl = (url: string, splitter: string): string[] => {
    return url.split(splitter);
}

export { splitUrl }