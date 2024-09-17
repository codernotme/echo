import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const FriendSuggestion = () => {
  // Dummy data for suggestions
  const suggestions = [
    {
      id: 1,
      name: 'Nick Shelburne',
      avatar: '/images/dum1.jpg',
    },
    {
      id: 2,
      name: 'Brittni Lando',
      avatar: '/images/dum2.jpg',
    },
    {
      id: 3,
      name: 'Ivan Shevchenko',
      avatar: '/images/dum3.jpg',
    },
  ];

  return (
    <div className="w-full h-full p-4 flex flex-col gap-2">
        <h1 className="text-lg font-semibold">Suggestions</h1>
    <Card className="w-full max-w-xs  justify-between p-4">
      <CardContent>
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">{user.name.split(' ')[0]}</p>
                <p className="text-sm text-gray-600">{user.name.split(' ')[1]}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Follow</Button>
          </div>
        ))}
        <div className="text-center mt-4">
          <a href="#" className="text-blue-600">See all</a>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default FriendSuggestion;
