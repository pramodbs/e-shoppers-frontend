import axios from 'axios';

const SearchService = {
    searchProducts: async (query) => {
        try {
            const response = await axios.get(`/api/search/product?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    },

    searchCategories: async (query) => {
        try {
            const response = await axios.get(`/api/search/category?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching categories:', error);
            return [];
        }
    },

    reindex: async () => {
        try {
            const response = await axios.post('/api/search/reindex');
            return response.data;
        } catch (error) {
            console.error('Error re-indexing:', error);
            throw error;
        }
    }
};

export default SearchService;
