import React, { useState } from 'react';

import { FullLayoutScrollable } from '@/layout';
import Password from './component/password';
import Profile from './component/profile';
import ContactAgent from './component/contactAgent';

const tabSelection = [
  {
    title: 'My Details',
    value: 'details',
    component: <Password />,
  },
  {
    title: 'Profile',
    value: 'profile',
    component: <Profile />,
  },
  {
    title: 'Password',
    value: 'password',
    component: <Password />,
  },
  {
    title: 'Contact Agent',
    value: 'contact',
    component: <ContactAgent />,
  },
];

const UserProfile = () => {
  const [tab, setTab] = useState('details');
  return (
    <FullLayoutScrollable>
      <section className="max-h-[calc(100% - 2rem)] flex h-full min-h-full flex-col gap-8 p-8">
        <h1 className="text-center text-4xl font-bold">Profile</h1>
        <div className="wrapper font-inter flex flex-col md:flex-row md:items-center">
          {tabSelection.map((item) => (
            <div
              onClick={() => setTab(item.value)}
              className={`grid flex-grow-0 cursor-pointer place-items-center border-b-4 border-transparent px-8 py-4 transition-all ${
                item.value === tab && 'border-zinc-900 font-bold'
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div>
          {tabSelection.map((item) => tab === item.value && item.component)}
        </div>
      </section>
    </FullLayoutScrollable>
  );
};

export default UserProfile;
