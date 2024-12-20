import React, { useEffect, useState } from "react";
import { Strings } from "@/app/strings";

interface Activity {
  Name: string;
  Email: string;
  Address: string;
  Phone: string | number;
  Upi: string | number;
  Money: string | number;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      const scriptUrl = Strings.sheetURL; 
      const response = await fetch(scriptUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-bold text-blue-900 p-6 border-b">
        Activities
      </h2>

      {loading && <p className="text-blue-500 p-6">Loading...</p>}
      {error && <p className="text-red-500 p-6">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Upi ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  User Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {activities.map((activity, index) => (
                <tr key={index} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {activity.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {activity.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {activity.Address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {activity.Phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {activity.Upi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    Rs {activity.Money}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

