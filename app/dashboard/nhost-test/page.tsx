'use client';

import React, { useState } from 'react';
import { useNhostQuery } from '@/lib/swr/use-nhost-query';
import { useNhostMutation } from '@/lib/swr/use-nhost-mutation';
import { mutate } from 'swr';

export default function NhostTestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Consulta para obtener usuarios
  const { data, error, isLoading } = useNhostQuery(`
    query GetUsers {
      users {
        id
        displayName
        email
      }
    }
  `);

  // Mutación para crear un usuario (ejemplo)
  const { execute: createUser, loading: creating } = useNhostMutation(`
    mutation CreateUser($name: String!, $email: String!) {
      insertUser(object: { displayName: $name, email: $email }) {
        id
        displayName
      }
    }
  `, {
    onSuccess: () => {
      // Revalidar la consulta de usuarios después de crear uno nuevo
      mutate({ query: 'query GetUsers { users { id displayName email } }' });
      setName('');
      setEmail('');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ name, email });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nhost + SWR Test</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create User</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name" 
                className="input input-bordered w-full" 
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email" 
                className="input input-bordered w-full" 
                required
              />
            </div>
            
            <div className="card-actions justify-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? <span className="loading loading-spinner"></span> : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <p>Error: {error.message}</p>
            </div>
          ) : data?.users?.length === 0 ? (
            <div className="alert alert-info">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map(user => (
                    <tr key={user.id}>
                      <td className="font-mono text-xs">{user.id}</td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}