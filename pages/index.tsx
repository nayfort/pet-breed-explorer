import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface DogBreed {
    id: string;
    name: string;
    reference_image_id?: string;
}

interface CatBreed {
    id: string;
    name: string;
    image?: {
        url: string;
    };
}

const fetchDogBreeds = async () => {
    const response = await axios.get<DogBreed[]>('https://api.thedogapi.com/v1/breeds');
    return response.data;
};

const fetchCatBreeds = async () => {
    const response = await axios.get<CatBreed[]>('https://api.thecatapi.com/v1/breeds');
    return response.data;
};

const Home = () => {
    const [dogBreeds, setDogBreeds] = useState<DogBreed[]>([]);
    const [catBreeds, setCatBreeds] = useState<CatBreed[]>([]);
    const [filteredBreeds, setFilteredBreeds] = useState<(DogBreed | CatBreed)[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<(DogBreed | CatBreed)[]>([]);

    useEffect(() => {
        const getBreeds = async () => {
            const dogs = await fetchDogBreeds();
            const cats = await fetchCatBreeds();
            setDogBreeds(dogs);
            setCatBreeds(cats);
            setFilteredBreeds([...dogs, ...cats]);
        };
        getBreeds();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = [...dogBreeds, ...catBreeds].filter(breed =>
            breed.name.toLowerCase().includes(term)
        );
        setFilteredBreeds(filtered);

        if (term.length > 0) {
            setSuggestions(filtered.slice(0, 5)); // Show up to 5 suggestions
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, dogBreeds, catBreeds]);

    const handleSuggestionClick = (suggestion: DogBreed | CatBreed) => {
        setSearchTerm(suggestion.name);
        setFilteredBreeds([suggestion]);
        setSuggestions([]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pet Breed Explorer</h1>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search breeds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-full"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute border bg-white w-full mt-1 max-h-48 overflow-y-auto z-10">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.id}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBreeds.map(breed => (
                    <BreedCard key={breed.id} breed={breed} type={'reference_image_id' in breed ? 'dog' : 'cat'} />
                ))}
            </div>
        </div>
    );
};

const BreedCard = ({ breed, type }: { breed: DogBreed | CatBreed, type: string }) => {
    const imageUrl = type === 'dog'
        ? `https://cdn2.thedogapi.com/images/${(breed as DogBreed).reference_image_id}.jpg`
        : (breed as CatBreed).image?.url;

    return (
        <Link href={`/breeds/${breed.id}?type=${type}`} legacyBehavior>
            <a className="border p-4 rounded shadow hover:shadow-lg transition">
                {imageUrl ? (
                    <img src={imageUrl} alt={breed.name} style={{width: '50%', height: '50%'}}  className="w-48 h-36 object-cover mb-2 mx-auto" />
                ) : (
                    <div className="w-48 h-36 bg-gray-200 flex items-center justify-center mx-auto">
                        No Image
                    </div>
                )}
                <h2 className="text-lg font-bold text-center">{breed.name}</h2>
            </a>
        </Link>
    );
};

export default Home;
