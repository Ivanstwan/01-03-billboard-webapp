import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui';
import { MainLayout } from '@/layout';

const EditListingImage = () => {
  // Accessing the id parameter from the URL
  const { id } = useParams();

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <div className="flex justify-between">
            <Link to={'/listing/edit/' + id}>
              <Button variant="link">
                <div>
                  <span>{'<'} </span>Edit Listing (1/2)
                </div>
              </Button>
            </Link>
          </div>
          <h1 className="pt-4 text-4xl font-bold">Edit Image (2/2)</h1>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditListingImage;
