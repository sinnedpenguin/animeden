interface PaginationProps {
  currentPage: number;
  setCurrentPage: (pageNum: number) => void;
  totalPages: number;
}

export default function Pagination({ currentPage, setCurrentPage, totalPages }: PaginationProps) {
  const buttonsToShow = 5;
  const halfButtonsToShow = Math.floor(buttonsToShow / 2);
  const buttons: number[] = [];

  const handleClick = (pageNum: number) => {
    if (pageNum > 0) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  for (let i = currentPage - halfButtonsToShow; i <= currentPage + halfButtonsToShow; i++) {
    if (i > 0 && i <= totalPages) {
      buttons.push(i);
    }
  }

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {buttons.map((pageNum) => (
        <span
          key={pageNum}
          onClick={() => handleClick(pageNum)}
          className={`cursor-pointer rounded px-3 text-sm ${
            currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
          } md:hidden lg:inline-flex`}
        >
          {pageNum}
        </span>
      ))}
    </div>
  );
}