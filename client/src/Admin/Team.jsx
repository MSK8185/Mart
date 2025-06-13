import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { teamData } from '../data';
 // Import the team data

const Team = () => {
  // Initialize the team data as state
  const [team, setTeam] = useState(teamData);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    joined: new Date().toLocaleDateString(),
  });
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };// Add a new member
  const handleAddMember = (e) => {e.preventDefault();
   setTeam([
      ...team,
      { ...newMember, id: team.length + 1 }    ]);
setNewMember({ name: '', role: '', email: '', joined: new Date().toLocaleDateString() });
    setShowAddMemberForm(false);
  };

  // Delete a member
  const handleDeleteMember = (id) => {
    setTeam(team.filter((member) => member.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Team</h2>
        <button
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
 >
        + Add Team Member
        </button>
 </div>

      {/* Add Team Member Form */}
      {showAddMemberForm && (
        <form onSubmit={handleAddMember} className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
  name="name"
              placeholder="Member Name"
              value={newMember.name}
  onChange={handleInputChange}
              required
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newMember.role}
              onChange={handleInputChange}
              required
              className="p-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newMember.email}
              onChange={handleInputChange}
              required
              className="p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add Member
          </button>
        </form>
      )}

      {/* Team Member List */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 border-b-2 text-left">Name</th>
              <th className="py-3 px-4 border-b-2 text-left">Role</th>
              <th className="py-3 px-4 border-b-2 text-left">Email</th>
              <th className="py-3 px-4 border-b-2 text-left">Joined</th>
              <th className="py-3 px-4 border-b-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{member.name}</td>
                <td className="py-3 px-4 border-b">{member.role}</td>
                <td className="py-3 px-4 border-b">{member.email}</td>
                <td className="py-3 px-4 border-b">{member.joined}</td>
                <td className="py-3 px-4 border-b text-center">
                  <button className="text-blue-600 hover:text-blue-800 px-3 py-1">
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Team;
