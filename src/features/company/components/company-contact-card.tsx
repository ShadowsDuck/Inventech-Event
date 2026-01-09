import React from 'react'
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';


import { CircleUserRound } from 'lucide-react';

export default function CompanyContactCard() {
  return (
    <div className="border border-gray-300 rounded-xl p-4 mb-4">
    
    <div className="flex gap-4"><CircleUserRound className="w-20 h-20 text-blue-400" strokeWidth="0.75"/>
    <div>
      <h3 className="text-2xl font-bold ">John Doe</h3>
      <h3 className="text-md font-semibold text-blue-600">Partnership Manager</h3>
        <div className="flex mt-2 gap-4">
      <p className="flex items-center text-sm text-gray-600 border border-blue-600 rounded-lg p-2 " ><Phone className="flex w-4 h-4 ml-1 mr-2 text-primary " />(123) 456-7890</p>
      <p className="flex items-center text-sm text-gray-600 border bg-muted rounded-lg p-2"><Mail className="flex w-4 h-4 ml-1 mr-2 text-primary" />john.doe@example.com</p>
      </div>
      </div>
      </div>
    </div>
  )
}
