'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import { Amenity, Listing } from '@/lib/types';
import { ArrowLeft, Check } from 'lucide-react';

function EditListingContent() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beachfront');
  const [propertyType, setPropertyType] = useState('Villa');
  
  const [pricePerNight, setPricePerNight] = useState<number | string>(350);
  const [cleaningFee, setCleaningFee] = useState<number | string>(75);
  const [serviceFee, setServiceFee] = useState<number | string>(40);
  
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2.0);

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');

  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
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
    const init = async () => {
      if (!listingId) return;
      try {
        const ams = await api.getAmenities();
        setAmenitiesList(ams);

        const data = await api.getListingById(listingId);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setPropertyType(data.property_type);
        setPricePerNight(data.price_per_night);
        setCleaningFee(data.cleaning_fee);
        setServiceFee(data.service_fee);
        setMaxGuests(data.max_guests);
        setBedrooms(data.bedrooms);
        setBeds(data.beds);
        setBaths(data.baths);
        setPhotos(data.photos?.map((p) => p.url) || []);
        setSelectedAmenityIds(data.amenities?.map((a) => a.id) || []);
      } catch (err) {
        addToast('error', 'Listing not found');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [listingId]);

  const handleToggleAmenity = (id: number) => {
    if (selectedAmenityIds.includes(id)) {
      setSelectedAmenityIds(selectedAmenityIds.filter((i) => i !== id));
    } else {
      setSelectedAmenityIds([...selectedAmenityIds, id]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.updateListing(listingId, {
        title,
        description,
        category,
        property_type: propertyType,
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

      addToast('success', 'Listing updated successfully!');
      setTimeout(() => {
        router.push('/host');
      }, 1200);
    } catch (err) {
      addToast('error', 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar mode="host" />
        <div className="max-w-4xl mx-auto p-12 w-full animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-64 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
      <Toast toasts={toasts} onClose={removeToast} />
      <Navbar mode="host" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Listing</h1>
            <p className="text-sm text-neutral-500 font-medium">Update pricing, photos, or property details</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200 shadow-xs">
          
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium"
              >
                {['Beachfront', 'Cabins', 'Mansions', 'OMG!', 'Countryside', 'Lakefront', 'Amazing pools', 'Icons'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Nightly Rate ($)</label>
              <input
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#FF385C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenitiesList.map((a) => {
                const isSel = selectedAmenityIds.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => handleToggleAmenity(a.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition ${
                      isSel ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSel ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-8 py-3 rounded-xl text-xs shadow-md transition"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function EditListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading editor...</div>}>
      <EditListingContent />
    </Suspense>
  );
}
