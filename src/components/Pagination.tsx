import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
    }

    const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onChangePage,
    }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) {
        onChangePage(currentPage - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
        onChangePage(currentPage + 1);
        }
    };

    // Формируем список страниц
    let pages: (number | string)[] = [];
    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
        }
    } else {
        for (let i = 1; i <= 7; i++) {
        pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
    }

    const handleClickPage = (p: number | string) => {
        if (p !== "...") {
        onChangePage(p as number);
        }
    };

    return (
        <div style={{ marginTop: 20 }}>
        <button onClick={handlePrev} disabled={currentPage === 1}>
            &lt;
        </button>

        {pages.map((p, idx) => (
            <button
            key={idx}
            onClick={() => handleClickPage(p)}
            disabled={p === "..."}
            style={{
                fontWeight: p === currentPage ? "bold" : "normal",
                margin: "0 5px",
            }}
            >
            {p}
            </button>
        ))}

        <button onClick={handleNext} disabled={currentPage === totalPages}>
            &gt;
        </button>
        </div>
    );
};

export default Pagination;