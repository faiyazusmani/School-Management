import React, { useState } from 'react';
import { Eye, Maximize2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const images = [
    // Campus (5 Distinct High-Res School Photos)
    {
      id: 1,
      title: 'Shimla International Public School Grand Facade',
      category: 'Campus',
      src: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      title: 'Central Academic Building & Campus Lawns',
      category: 'Campus',
      src: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: 'Student Open-Air Amphitheatre & Plaza',
      category: 'Campus',
      src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 4,
      title: 'School Clock Tower & Heritage Campus Quad',
      category: 'Campus',
      src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 5,
      title: 'Green Campus Botanical Gardens & Walkways',
      category: 'Campus',
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    },

    // Labs (5 Photos)
    {
      id: 6,
      title: 'State-of-the-Art Science Research Lab',
      category: 'Labs',
      src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 7,
      title: 'Robotics & AI Automation Workshop Lab',
      category: 'Labs',
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 8,
      title: 'Advanced Chemistry & Molecular Bio Lab',
      category: 'Labs',
      src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 9,
      title: 'Physics Optics & Electronics Research Lab',
      category: 'Labs',
      src: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 10,
      title: 'High-Speed Computer & Data Science Lab',
      category: 'Labs',
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    },

    // Library (5 Photos)
    {
      id: 11,
      title: 'Modern Digital Media & E-Resource Library',
      category: 'Library',
      src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 12,
      title: 'Quiet Study Sanctuary & Reading Pods',
      category: 'Library',
      src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 13,
      title: 'Grand Wooden Bookshelf Reference Archive',
      category: 'Library',
      src: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 14,
      title: 'Digital Research Terminal & Online Catalog',
      category: 'Library',
      src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 15,
      title: 'Collaborative Group Discussion & Study Tables',
      category: 'Library',
      src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    },

    // Sports (5 Photos: Cricket, Football, Badminton, Hockey, Kabaddi)
    {
      id: 16,
      title: 'Championship Cricket Stadium & Practice Nets',
      category: 'Sports',
      src: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 17,
      title: 'Championship Football Turf & League Pitch',
      category: 'Sports',
      src: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 18,
      title: 'Indoor Badminton Court & Shuttlecock Tournament',
      category: 'Sports',
      src: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 19,
      title: 'Field Hockey Championship Turf & Sports Arena',
      category: 'Sports',
      src: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 20,
      title: 'Pro Kabaddi Mat Arena & Athletics Stadium',
      category: 'Sports',
      src: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&q=80&w=800',
    },

    // Events (5 Photos)
    {
      id: 21,
      title: 'Annual Cultural Festival & Concert Stage',
      category: 'Events',
      src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 22,
      title: 'Graduation Ceremony & Convocation Hall',
      category: 'Events',
      src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 23,
      title: 'Inter-School Science Fair & Innovation Expo',
      category: 'Events',
      src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 24,
      title: 'Drama Auditorium & Performing Arts Theatre',
      category: 'Events',
      src: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 25,
      title: 'Annual Sports Day & Trophy Presentation',
      category: 'Events',
      src: 'https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const categories = ['All', 'Campus', 'Labs', 'Library', 'Sports', 'Events'];

  // Default featured 6 cards for main page grid
  const featuredCards = [
    images.find((img) => img.id === 6),  // Labs
    images.find((img) => img.id === 1),  // Campus
    images.find((img) => img.id === 11), // Library
    images.find((img) => img.id === 17), // Sports (Football)
    images.find((img) => img.id === 21), // Events
    images.find((img) => img.id === 7),  // Labs Robotics
  ].filter(Boolean);

  const displayGrid =
    activeCategory === 'All'
      ? featuredCards
      : images.filter((img) => img.category === activeCategory);

  const categoryPhotos = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : [];

  const handleOpenCategoryModal = (catName, initialIdx = 0) => {
    setSelectedCategory(catName);
    setActivePhotoIndex(initialIdx);
  };

  const getFallbackSrc = (categoryName) => {
    switch (categoryName) {
      case 'Campus':
        return 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800';
      case 'Sports':
        return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800';
      case 'Labs':
        return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800';
      case 'Library':
        return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800';
      default:
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
    }
  };

  return (
    <section id="gallery" className="py-24 bg-slate-950 dark:bg-slate-950 light:bg-white border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Badge variant="purple">CAMPUS GALLERY</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Explore Shimla International Public School
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Click on any section to view all 5 HD photos of our modern campus facilities, labs, library, sports, and events.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white dark:bg-slate-900 light:bg-slate-100 light:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Exact 6 Featured Layout as before */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGrid.map((img) => {
            return (
              <div
                key={img.id}
                onClick={() => handleOpenCategoryModal(img.category, 0)}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-slate-800/80 shadow-xl"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackSrc(img.category);
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                  <div>
                    <Badge variant="success" className="mb-1 text-[10px]">
                      {img.category}
                    </Badge>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {img.title}
                    </h4>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Photo Category Lightbox Modal */}
      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={`${selectedCategory || ''} Section - Photo Gallery (5 HD Photos)`}
      >
        {categoryPhotos.length > 0 && (
          <div className="space-y-4">
            {/* Active Large Display Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={categoryPhotos[activePhotoIndex]?.src}
                alt={categoryPhotos[activePhotoIndex]?.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackSrc(selectedCategory);
                }}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  Photo {activePhotoIndex + 1} of {categoryPhotos.length}
                </p>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {categoryPhotos[activePhotoIndex]?.title}
                </h3>
              </div>
            </div>

            {/* 5 Photo Thumbnails Bar */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 text-center">
                Click any thumbnail below to view all 5 photos of {selectedCategory}:
              </p>
              <div className="grid grid-cols-5 gap-2">
                {categoryPhotos.map((photo, pIdx) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(pIdx)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                      activePhotoIndex === pIdx
                        ? 'border-indigo-500 scale-105 shadow-lg shadow-indigo-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackSrc(selectedCategory);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-black text-white text-center py-0.5">
                      #{pIdx + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
