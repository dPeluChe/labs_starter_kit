import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users - Feedby',
  description: 'Manage your users',
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Management</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>Admin</td>
                  <td><div className="badge badge-success">Active</div></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-primary">Edit</button>
                      <button className="btn btn-xs btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>Editor</td>
                  <td><div className="badge badge-success">Active</div></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-primary">Edit</button>
                      <button className="btn btn-xs btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Bob Johnson</td>
                  <td>bob@example.com</td>
                  <td>Viewer</td>
                  <td><div className="badge badge-warning">Pending</div></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-primary">Edit</button>
                      <button className="btn btn-xs btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Alice Brown</td>
                  <td>alice@example.com</td>
                  <td>Editor</td>
                  <td><div className="badge badge-error">Inactive</div></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-primary">Edit</button>
                      <button className="btn btn-xs btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary">Add New User</button>
          </div>
        </div>
      </div>
    </div>
  );
}