
const paramString = window.location.search;
const paramMatch = [...paramString.matchAll(/[?&](?<key>[a-z]+)=(?<value>[a-z\d]+)/g)];
const urlParams = paramMatch.reduce((obj:any, match) => {
  const key = match?.groups?.key as string;
  const value = match?.groups?.value as string;
  obj[key] = value;

  return obj;
}, {});

export { 
    urlParams
}