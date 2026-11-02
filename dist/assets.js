export async function loadKanto(){
 const response=await fetch(new URL('./kanto.geojson',import.meta.url));
 if(!response.ok)throw new Error('関東の地図を読み込めませんでした。');
 return response.json();
}
export function licenseURL(){return new URL('./licenses.txt',import.meta.url).href}
