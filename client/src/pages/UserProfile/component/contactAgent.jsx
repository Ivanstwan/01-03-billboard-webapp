import { Input } from '@/components/ui/input';
import React from 'react';

const ContactAgent = () => {
  return (
    <div>
      <Input type="text" placeholder="Contact Number" value={''} />
      <Input type="text" placeholder="Email" disabled value={''} />
    </div>
  );
};

export default ContactAgent;
