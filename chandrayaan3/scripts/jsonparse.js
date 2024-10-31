async function fetchJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('Error fetching JSON file:', error);
    }
}

export { fetchJSONFile }