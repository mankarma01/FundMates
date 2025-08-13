import { useState } from "react";
import axios from "axios";
import { X, Trash } from "lucide-react";

export default function Group({ onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState("");
  const [memberEmails, setMemberEmails] = useState([""]);
  const [memberErrors, setMemberErrors] = useState([""]);
  const [memberIds, setMemberIds] = useState([""]);
  const [formError, setFormError] = useState("");
  const [memberNames, setMemberNames] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAddMember = () => {
    setMemberEmails((prev) => [...prev, ""]);
    setMemberErrors((prev) => [...prev, ""]);
    setMemberIds((prev) => [...prev, ""]);
    setMemberNames((prev) => [...prev, ""]);
  };

  const handleRemoveMember = (index) => {
    setMemberEmails((prev) => prev.filter((_, i) => i !== index));
    setMemberErrors((prev) => prev.filter((_, i) => i !== index));
    setMemberIds((prev) => prev.filter((_, i) => i !== index));
    setMemberNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeMember = (index, value) => {
    const updatedEmails = [...memberEmails];
    updatedEmails[index] = value;
    setMemberEmails(updatedEmails);

    const updatedErrors = [...memberErrors];
    updatedErrors[index] = ""; // clear errors on change
    setMemberErrors(updatedErrors);

    const updatedNames = [...memberNames];
    updatedNames[index] = "";
    setMemberNames(updatedNames);

    const updatedIds = [...memberIds];
    updatedIds[index] = "";
    setMemberIds(updatedIds);
  };

  const handleValidateEmail = async (index) => {
    const token = localStorage.getItem("token");
    const email = memberEmails[index].trim();

    if (!email || !email.includes("@")) {
      // If invalid email format, skip validation
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/users/by-email/${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userId = res.data.id || res.data._id; // Adjust based on your backend response
      const userName = res.data.name;

      const updatedIds = [...memberIds];
      updatedIds[index] = userId;
      setMemberIds(updatedIds);

      const updatedNames = [...memberNames];
      updatedNames[index] = userName;
      setMemberNames(updatedNames);

      const updatedErrors = [...memberErrors];
      updatedErrors[index] = "";
      setMemberErrors(updatedErrors);
    } catch (error) {
      const updatedErrors = [...memberErrors];
      updatedErrors[index] = "User not found";
      setMemberErrors(updatedErrors);

      const updatedIds = [...memberIds];
      updatedIds[index] = "";
      setMemberIds(updatedIds);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("You must be logged in to create a group.");
      return;
    }

    if (!groupName.trim()) {
      setFormError("Group name is required.");
      return;
    }

    if (memberIds.length === 0 || memberIds.some((id) => !id)) {
      setFormError(
        "Please ensure all member emails are valid before submitting."
      );
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/groups`,
        {
          groupName: groupName.trim(),
          members: memberIds.map((id, index) => ({
            userId: id,
            name: memberNames[index],
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onGroupCreated?.(data);
      alert("Group Created Successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create group", error);
      setFormError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">
          🚀 Create a New Group
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        {/* Member Inputs */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Add Members
          </label>
          <div className="space-y-3">
            {memberEmails.map((email, index) => (
              <div key={index} className="space-y-1">
                <input
                  type="email"
                  placeholder={`Member ${index + 1} Email`}
                  value={email}
                  onChange={(e) => handleChangeMember(index, e.target.value)}
                  onBlur={() => handleValidateEmail(index)}
                  className={`w-full rounded-md border p-3 ${
                    memberErrors[index]
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                  required
                />
                <div className="flex justify-between items-center">
                  {memberErrors[index] && (
                    <p className="text-sm text-red-600">
                      {memberErrors[index]}
                    </p>
                  )}
                  {memberEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove this member"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMember}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another member
            </button>
          </div>
        </div>

        {formError && (
          <div className="mb-4 text-sm text-red-600 font-medium">
            {formError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}
