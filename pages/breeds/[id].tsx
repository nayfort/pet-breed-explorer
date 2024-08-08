import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DogBreed {
    id: string;
    name: string;
    description?: string;
    reference_image_id?: string;
}

interface CatBreed {
    id: string;
    name: string;
    description?: string;
    reference_image_id?: string;
}

interface BreedImage {
    url: string;
    id: string;
    breeds?: DogBreed[];
}

const BreedPage = () => {
    const router = useRouter();
    const { id, type } = router.query;
    const [breed, setBreed] = useState<DogBreed | CatBreed | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (id && type) {
            const fetchBreed = async () => {
                const apiUrl = type === 'dog'
                    ? `https://api.thedogapi.com/v1/images/search?breed_ids=${id}&limit=10`
                    : `https://api.thecatapi.com/v1/images/search?breed_ids=${id}&limit=10`;
                try {
                    const response = await axios.get<BreedImage[]>(apiUrl);
                    console.log('API Response:', response.data);
                    if (response.data.length > 0) {
                        const breedData = response.data[0];
                        if (type === 'dog' && breedData.breeds && breedData.breeds.length > 0) {
                            console.log('Dog Breed Data:', breedData.breeds[0]);
                            setBreed(breedData.breeds[0]);
                        } else if (type === 'dog') {
                            setBreed({
                                id: breedData.id,
                                name: 'Unknown Dog Breed',
                                description: 'No description available',
                                reference_image_id: breedData.id,
                            });
                        } else if (type === 'cat') {
                            console.log('Cat Breed Data:', breedData);
                            setBreed({
                                id: breedData.id,
                                name: breedData.breeds ? breedData.breeds[0].name : 'Unknown Cat Breed',
                                description: breedData.breeds ? breedData.breeds[0].description : 'No description available',
                                reference_image_id: breedData.id,
                            });
                        }
                        setImageUrls(response.data.map(img => img.url));
                    }
                } catch (error) {
                    console.error('Error fetching breed data:', error);
                }
            };
            fetchBreed();
        }
    }, [id, type]);

    if (!breed) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{breed.name}</h1>
            {imageUrls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {imageUrls.map((url, index) => (
                        <img key={index} src={url} alt={breed.name} style={{width: '70%', height: '70%'}} className="w-full h-64 object-cover mb-4" />
                    ))}
                </div>
            ) : (
                <div>No images available</div>
            )}
            {breed.description && <p>{breed.description}</p>}
        </div>
    );
};

export default BreedPage;
