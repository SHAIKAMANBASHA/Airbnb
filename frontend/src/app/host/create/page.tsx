'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Amenity } from '@/lib/types';
import { PlusCircle, Image as ImageIcon, Check, ArrowLeft, Building2 } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beachfront');
  const [propertyType, setPropertyType] = useState('Villa');
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [pricePerNight, setPricePerNight] = useState<number | string>(350);
  const [cleaningFee, setCleaningFee] = useState<number | string>(75);
  const [serviceFee, setServiceFee] = useState<number | string>(40);
  
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2.0);

  // Photos
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ]);

  // Amenities
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    api.getAmenities().then((data) => {
      setAmenitiesList(data);
      setSelectedAmenityIds(data.slice(0, 5).map((a) => a.id));
    }).catch(console.error);
  }, []);

  const handleAddPhoto = () => {
    if (!photoUrlInput.trim()) return;
    setPhotos([...photos, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleToggleAmenity = (id: number) => {
    if (selectedAmenityIds.includes(id)) {
      setSelectedAmenityIds(selectedAmenityIds.filter((item) => item !== id));
    } else {
      setSelectedAmenityIds([...selectedAmenityIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city.trim() || !address.trim()) {
      addToast('error', 'Please fill in all required fields');
      return;
    }
    if (photos.length === 0) {
      addToast('error', 'Please add at least one photo URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createListing({
        title,
        description,
        category,
        property_type: propertyType,
        room_type: 'Entire place',
        address,
        city,
        state,
        country,
        price_per_night: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee),
        service_fee: Number(serviceFee),
        max_guests: maxGuests,
        bedrooms,
        beds,
        baths,
        photos,
        amenity_ids: selectedAmenityIds
      }, 1);

      addToast('success', 'Listing created successfully!');
      setTimeout(() => {
        router.push('/host');
      }, 1500);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar mode="host" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Airbnb your home</h1>
            <p className="text-sm text-neutral-500 font-medium">Create a new property listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200 shadow-xs">
          
          {/* Section 1: Title & Category */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Listing Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Oceanfront Glass Villa"
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none cursor-pointer"
                >
                  {['Beachfront', 'Cabins', 'Mansions', 'OMG!', 'Countryside', 'Lakefront', 'Amazing pools', 'Icons'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Property Type *</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none cursor-pointer"
                >
                  {['Villa', 'Chalet', 'Mansion', 'House', 'Apartment', 'Dome', 'Cave House', 'A-Frame', 'Treehouse'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes your space special, the views, comfort, and amenities..."
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              2. Location Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 22400 Pacific Coast Highway"
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Malibu"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. California"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Capacity & Pricing */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              3. Pricing & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nightly Rate ($) *</label>
                <input
                  type="number"
                  required
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Cleaning Fee ($)</label>
                <input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Service Fee ($)</label>
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Max Guests</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Beds</label>
                <input
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Photos */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              4. Photos (URLs)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Paste Unsplash image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 bg-white border border-neutral-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-5 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shrink-0"
              >
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {photos.map((url, index) => (
                <div key={index} className="relative aspect-4/3 rounded-2xl overflow-hidden border border-neutral-300 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full text-xs opacity-80 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Amenities */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              5. Select Amenities
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenitiesList.map((a) => {
                const isSelected = selectedAmenityIds.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => handleToggleAmenity(a.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-neutral-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing Property...' : 'Publish Listing'}
            </button>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}
