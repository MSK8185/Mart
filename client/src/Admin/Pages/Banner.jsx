import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const bannerRefs = useRef([]);
  const dropRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length && bannerRefs.current.length) {
      gsap.from(bannerRefs.current, {
        opacity: 1,
        y: 30,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://20.40.59.234:3000/api/banners/get");
      setBanners(Array.isArray(res.data) ? res.data : res.data.banners || []);
    } catch (err) {
      console.error("Error fetching banners", err);
      setError("Failed to fetch banners");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    setError("");

    if (banners.length >= 4) {
      setError("You can only add up to 4 banners.");
      return;
    }

    if (!image) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    if (title.trim()) formData.append("title", title.trim());

    try {
      setLoading(true);
      await axios.post("http://20.40.59.234:3000/api/banners/upload", formData);
      setTitle("");
      setImage(null);
      fetchBanners();
    } catch (err) {
      console.error("Error adding banner", err);
      setError("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (public_id) => {
    try {
      await axios.delete("http://20.40.59.234:3000/api/banners/delete", {
        data: { public_id },
      });
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner", err);
      setError("Failed to delete banner.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current?.classList.add("ring-2", "ring-blue-400");
    gsap.to(dropRef.current, { scale: 1.02, duration: 0.2 });
  };

  const handleDragLeave = () => {
    dropRef.current?.classList.remove("ring-2", "ring-blue-400");
    gsap.to(dropRef.current, { scale: 1, duration: 0.2 });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current?.classList.remove("ring-2", "ring-blue-400");
    gsap.to(dropRef.current, { scale: 1, duration: 0.2 });

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Only image files are allowed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🎯 Manage Banners
      </h2>

      {/* Form */}
      <form
        onSubmit={handleAddBanner}
        className="mb-10 bg-white shadow-md p-6 rounded-xl space-y-4 border"
      >
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer hover:border-blue-400 transition-all"
        >
          <p className="text-sm text-center px-2">
            Drag & drop your banner here or click to upload
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {image && (
          <div className="mt-4 relative group">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full max-h-40 object-contain rounded-md shadow"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕ Remove
            </button>
            <p className="text-xs text-green-600 mt-2">{image.name}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Banner"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>

      {/* Banner List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {banners.map(({ _id, url, title, public_id }, index) => (
          <div
            key={_id}
            ref={(el) => (bannerRefs.current[index] = el)}
            className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border"
          >
            <img
              src={url}
              alt={title || "Banner"}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              {title && <p className="font-medium text-gray-800">{title}</p>}
              <button
                onClick={() => {
                  setBannerToDelete({ public_id, url });
                  setShowConfirm(true);
                }}
                className="text-red-600 text-sm mt-2 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && bannerToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              🗑 Confirm Deletion
            </h3>
            <p className="mb-2 text-gray-700">
              Are you sure you want to delete this banner?
            </p>
            <p className="text-xs text-gray-500 break-all mb-4">
              {bannerToDelete.url}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setBannerToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteBanner(bannerToDelete.public_id);
                  setShowConfirm(false);
                  setBannerToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
