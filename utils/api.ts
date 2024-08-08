import axios from 'axios';

const DOG_API_URL = 'https://api.thedogapi.com/v1/breeds';
const CAT_API_URL = 'https://api.thecatapi.com/v1/breeds';

export const fetchDogBreeds = async () => {
    const response = await axios.get(DOG_API_URL);
    console.log('Fetched Dog Breeds:', response.data);
    return response.data;
};

export const fetchCatBreeds = async () => {
    const response = await axios.get(CAT_API_URL);
    console.log('Fetched Cat Breeds:', response.data);
    return response.data;
};
