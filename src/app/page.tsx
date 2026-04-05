import ProductList from "@/components/ProductList";

const Home = async ({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        sort?: string;
        filter?: string;
        search?: string;
    }>;
}) => {
    const { category = "", sort = "", filter = "", search = "" } = await searchParams;

    return (
        <div className="flex-1 flex flex-col">
            <ProductList category={category} sort={sort} filter={filter} search={search} />
        </div>
    );
};

export default Home;
