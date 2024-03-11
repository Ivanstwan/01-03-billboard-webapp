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
import useScreenWidth from '@/hooks/pagination/useScreenWidth';

const itemPerPage = 10;

const tableConfig = [
  // { value: 'id', title: 'ID', className: 'font-medium' },
  {
    value: 'ads_name',
    title: 'Advertisement Title',
    className: 'font-medium max-w-[250px] min-w-[120px] w-[15%]',
    mobileClassName: 'font-medium w-[20%]',
  },
  {
    value: 'location',
    title: 'Location',
    className: 'font-medium max-w-[250px] min-w-[120px] w-[15%]',
    mobileClassName: 'font-medium w-[20%]',
  },
  {
    value: 'size_length',
    title: 'Length (cm)',
    className: 'w-[6%]',
  },
  { value: 'size_height', title: 'Height (cm)', className: 'w-[6%]' },
  { value: 'latitude', title: 'Latitude', className: 'w-[8%]' },
  { value: 'longitude', title: 'Longitude', className: 'w-[8%]' },
  {
    value: 'ads_status_id',
    title: 'Visibility Status',
    className: 'w-[8%]',
    mobileClassName: 'font-medium w-[15%]',
  },
  {
    value: 'ads_type_id',
    title: 'Ads Type',
    className: 'w-[8%]',
    mobileClassName: 'font-medium w-[15%]',
  },
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
  const screenWidth = useScreenWidth();
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
      <Table className="w-full table-fixed">
        <TableCaption>A list of your advertisement listing.</TableCaption>
        <TableHeader>
          <TableRow>
            {screenWidth >= 1024 && (
              <>
                {tableConfig.map((key) => (
                  <TableHead className={key.className} key={key.title}>
                    {key.title}
                  </TableHead>
                ))}
                <TableHead className="w-20 pl-4">Action</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </>
            )}
            {screenWidth < 1024 && (
              <>
                {[...tableConfig.slice(0, 2), ...tableConfig.slice(-2)].map(
                  (key) => (
                    <TableHead className={key.mobileClassName} key={key.title}>
                      {key.title}
                    </TableHead>
                  )
                )}
                <TableHead className="w-20 pl-4">Action</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {listing.length > 0 && (
            <>
              {listing.slice(startIndex, endIndex).map((item, idx) => (
                <TableRow key={idx} className="w-full">
                  {screenWidth >= 1024 && (
                    <>
                      {tableConfig.map((config) => (
                        <TableCell
                          key={config.value}
                          className={`${config.className} overflow-hidden break-words`}
                        >
                          {/* incase text takes too many row */}
                          <div className="min-w-[100px]">
                            {item[config.value] ?? '-'}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="w-[8%]">
                        <Link to={`/listing/edit/${item.id}`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="w-[8%]">
                        <Link to={`/listing/edit-image/${item.id}`}>
                          <Button variant="outline">Edit Image</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="w-[8%]">
                        <Link to={`/listing/edit/${item.id}`}>
                          <Button variant="destructive">Remove</Button>
                        </Link>
                      </TableCell>
                    </>
                  )}
                  {screenWidth < 1024 && (
                    <>
                      {[
                        ...tableConfig.slice(0, 2),
                        ...tableConfig.slice(-2),
                      ].map((config) => (
                        <TableCell
                          key={config.value}
                          className={`${config.className} overflow-hidden break-words`}
                        >
                          {/* incase text takes too many row */}
                          <div className="min-w-[100px]">
                            {item[config.value] ?? '-'}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Link to={`/listing/edit/${item.id}`}>
                            <Button variant="outline">Edit</Button>
                          </Link>
                          <Link to={`/listing/edit-image/${item.id}`}>
                            <Button variant="outline">Edit Image</Button>
                          </Link>
                        </div>
                        <Link to={`/listing/edit/${item.id}`}>
                          <Button variant="destructive">Remove</Button>
                        </Link>
                      </TableCell>
                    </>
                  )}
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
