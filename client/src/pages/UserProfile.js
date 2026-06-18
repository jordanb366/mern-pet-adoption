import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const profileResponse = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = await profileResponse.json();
        setProfileData(profileData);
        // Initialize form with current data
        setFormData({ name: profileData.name, email: profileData.email });

        const adoptionsResponse = await fetch(`${API_URL}/api/adoptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const adoptionsData = await adoptionsResponse.json();
        if (adoptionsResponse.ok) {
          setAdoptionRequests(adoptionsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, API_URL]);

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Name and email are required" });
      return;
    }

    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfileData(data);
        setIsEditing(false);
      } else {
        setMessage({
          type: "error",
          text: data.msg || "Failed to update profile",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      <h1>{profileData.name}'s Profile</h1>
      {!isEditing ? (
        // VIEW MODE
        <div>
          <p>Email: {profileData.email}</p>
          <p>
            Joined Date: {new Date(profileData.createdAt).toLocaleDateString()}
          </p>
          <button onClick={handleEditClick}>Edit Profile</button>
        </div>
      ) : (
        // EDIT MODE
        <div>
          <p>Edit your profile:</p>
          {message.text && (
            <div style={{ color: message.type === "error" ? "red" : "green" }}>
              {message.text}
            </div>
          )}
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSaveClick} disabled={updating}>
            {updating ? "Saving..." : "Save"}
          </button>
          <button onClick={handleCancelClick} disabled={updating}>
            Cancel
          </button>
        </div>
      )}

      <h2>Adoption Requests</h2>
      {adoptionRequests.length === 0 ? (
        <p>No adoption requests found.</p>
      ) : (
        <ul>
          {adoptionRequests.map((request) => (
            <li key={request._id}>
              Pet: {request.pet.name} - Status: {request.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
