export const  getFileVersion = async () => {
    const response = await fetch("https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json");
    return response.json();
}