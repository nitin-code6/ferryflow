import { Search } from "lucide-react";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search..."
}) => {

    return (
        <div className="relative mb-6">

            <Search
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-base-content/40
                "
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                input
                input-bordered
                w-full
                h-12
                rounded-xl
                pl-11
                border-slate-300
                focus:border-[#0EA5E9]
                focus:ring-4
                focus:ring-[#0EA5E9]/15
                transition-all
                duration-300
                "
            />

        </div>
    );
};

export default SearchBar;