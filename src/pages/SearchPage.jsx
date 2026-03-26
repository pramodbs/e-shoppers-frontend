import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchService from '../services/SearchService';
import ProductCard from '../components/common/ProductCard';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { BreadCrumb } from 'primereact/breadcrumb';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (query) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        setError('');
        try {
            const [prods, cats] = await Promise.all([
                SearchService.searchProducts(query),
                SearchService.searchCategories(query)
            ]);
            setProducts(prods || []);
            setCategories(cats || []);
        } catch (err) {
            console.error("Search fetch failed", err);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Search', url: '/search' },
        { label: query }
    ];
    const home = { icon: 'pi pi-home', url: '/' };

    const itemTemplate = (product) => {
        return <ProductCard product={product} />;
    };

    return (
        <div className="surface-ground min-h-screen p-4">
            <BreadCrumb model={breadcrumbItems} home={home} className="mb-4 bg-transparent border-none p-0" />
            
            <div className="flex align-items-center justify-content-between mb-5">
                <h1 className="text-3xl font-bold m-0">
                    Results for "<span className="text-primary">{query}</span>"
                    {loading && <i className="pi pi-spin pi-spinner ml-3 text-xl"></i>}
                </h1>
                <span className="text-600 font-medium">
                    Found {products.length} products and {categories.length} categories
                </span>
            </div>

            {error && <Message severity="error" text={error} className="w-full mb-4" />}

            {categories.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-700 mb-3 px-2 uppercase tracking-wider">Related Categories</h3>
                    <div className="flex flex-wrap gap-2 px-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="p-3 surface-card border-round-xl shadow-1 cursor-pointer hover:shadow-3 hover:surface-hover transition-all flex align-items-center gap-2 border-1 border-transparent hover:border-primary">
                                <i className="pi pi-tag text-primary"></i>
                                <span className="font-semibold">{cat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4">
                <h3 className="text-xl font-bold text-700 mb-4 px-2 uppercase tracking-wider">Matching Products</h3>
                <DataView value={products} itemTemplate={itemTemplate} layout="grid" />

                {!loading && products.length === 0 && (
                    <div className="text-center p-8 surface-card border-round-xl shadow-2 mt-4">
                        <i className="pi pi-search-minus text-600 text-6xl mb-4"></i>
                        <h2 className="text-900 font-bold mb-2">No products found</h2>
                        <p className="text-600 text-lg">We couldn't find any products matching your search criteria. Try using different keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
