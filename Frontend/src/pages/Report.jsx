import React, { useState } from "react";

const Report = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      location,
      category,
      priority,
      image,
      createdAt: new Date().toISOString(),
    };

    console.log("Submitted Report:", formData);

    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);
    setLocation("");
    setCategory("");
    setPriority("");
    alert("✅ Report submitted!");
  };

  return (
    <div className="pt-20 px-4 flex justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Report Road Issue</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="e.g. Big pothole near junction"
          />

          <label className="block mb-2 font-medium">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="Describe the issue in detail..."
          ></textarea>

          <label className="block mb-2 font-medium">Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="e.g. Near City Mall, MG Road"
          />

          <label className="block mb-2 font-medium">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 bg-white"
          >
            <option value="">-- Select a category --</option>
            <option value="Pothole">🕳️ Pothole</option>
            <option value="Speed Bump">⛰️ Speed Bump</option>
            <option value="Road Crack">⚡ Road Crack</option>
            <option value="Faded Markings">🚧 Faded Markings</option>
            <option value="Debris">🪨 Debris</option>
            <option value="Other">📋 Other</option>
          </select>

          <label className="block mb-2 font-medium">Priority</label>
          <select
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 bg-white"
          >
            <option value="">-- Select Priority --</option>
            <option value="High">🔴 High – Dangerous or accident-prone</option>
            <option value="Medium">🟠 Medium – Disruptive but manageable</option>
            <option value="Low">🟢 Low – Minor inconvenience</option>
          </select>

          <label className="block mb-2 font-medium">Photo (optional)</label>
          <div className="mb-4">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-white text-blue-700 font-semibold border border-blue-700 rounded hover:bg-blue-700 hover:text-white transition duration-200 cursor-pointer"
            >
              📷 Upload Photo
            </label>
            {image && (
              <p className="mt-2 text-sm text-gray-700">
                Selected: <span className="font-medium">{image.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;
