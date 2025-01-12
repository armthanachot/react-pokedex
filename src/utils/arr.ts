const lastItem = (arr: (Number[] | String[] | any[])): (Number[] | String[] | any[]) => {
    return arr[arr.length - 1];
};

export { lastItem };