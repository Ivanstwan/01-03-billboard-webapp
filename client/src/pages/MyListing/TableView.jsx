import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import usePaginationCell from '@/hooks/pagination/usePaginationCell';

const itemPerPage = 10;

const tableConfig = [
  // { value: 'id', title: 'ID', className: 'font-medium' },
  { value: 'ads_name', title: 'Advertisement Title', className: 'font-medium' },
  { value: 'location', title: 'Location', className: 'font-medium' },
  { value: 'size_length', title: 'Length (cm)' },
  { value: 'size_height', title: 'Height (cm)' },
  { value: 'latitude', title: 'Latitude' },
  { value: 'longitude', title: 'Longitude' },
  { value: 'ads_status_id', title: 'Visibility Status' },
  { value: 'ads_type_id', title: 'Ads Type' },
];

const PaginationDemo = ({ totalPages, itemPerPage, currentPage, goToPage }) => {
  const paginationCell = usePaginationCell({
    totalPages,
    currentPage,
  });
  return (
    <Pagination>
      <PaginationContent>
        {totalPages > 0 ? (
          <>
            <PaginationItem
              className={
                currentPage === 0 && 'pointer-events-none text-slate-400'
              }
            >
              <PaginationPrevious
                href="#"
                onClick={() => goToPage(currentPage - 1)}
              />
            </PaginationItem>
            {paginationCell.length > 0 &&
              paginationCell.map((page, idx) => {
                return page !== '...' ? (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      onClick={() => goToPage(page - 1)}
                      className={page - 1 === currentPage && 'bg-slate-200'}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              })}
            <PaginationItem
              className={
                currentPage === totalPages - 1 &&
                'pointer-events-none text-slate-400'
              }
            >
              <PaginationNext
                href="#"
                onClick={() => goToPage(currentPage + 1)}
              />
            </PaginationItem>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="font-semibold">You have no listing. Go add one?</p>
            <Link to={'/listing/add'}>
              <Button>Add Listing</Button>
            </Link>
          </div>
        )}
      </PaginationContent>
    </Pagination>
  );
};

const TableView = ({ listing }) => {
  const [page, setPage] = useState(0);

  const startIndex = page * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const totalPages =
    listing?.length > 0 ? Math.ceil(listing.length / itemPerPage) : 0;

  const goToPage = (toPage) => {
    setPage(toPage);
  };

  return (
    <>
      <Table>
        <TableCaption>A list of your advertisement listing.</TableCaption>
        <TableHeader>
          <TableRow>
            {tableConfig.map((key) => (
              <TableHead className={key.className} key={key.title}>
                {key.title}
              </TableHead>
            ))}
            <TableHead className="w-20 pl-4">Action</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listing.length > 0 && (
            <>
              {listing.slice(startIndex, endIndex).map((item, idx) => (
                <TableRow key={idx}>
                  {tableConfig.map((config) => (
                    <TableCell key={config.value} className={config.className}>
                      {item[config.value] ?? '-'}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Link to={`/listing/edit/${item.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/listing/edit/${item.id}`}>
                      <Button variant="destructive">Remove</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      <PaginationDemo
        className="w-full"
        itemPerPage={itemPerPage}
        totalPages={totalPages}
        currentPage={page}
        goToPage={goToPage}
      />
    </>
  );
};

export default TableView;
