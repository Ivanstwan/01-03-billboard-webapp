import { Input } from '@/components/ui/input';
import React from 'react';

const Profile = () => {
  return (
    <div>
      <div>
        <img alt="No User Photo" className="h-8 w-8 rounded-full" />
      </div>
      <Input type="text" placeholder="Username" value={''} />
      <Input type="text" placeholder="Email" disabled value={''} />
    </div>
  );
};

export default Profile;
